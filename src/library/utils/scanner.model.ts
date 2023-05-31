import path from "path";
import _ from "lodash";
import { Audio } from "@async3619/merry-go-round";
import { DeepPartial } from "typeorm";

import { MusicService } from "@main/music/music.service";
import { Music } from "@main/music/models/music.model";

import { ArtistService } from "@main/artist/artist.service";
import { Artist } from "@main/artist/models/artist.model";

import { AlbumService } from "@main/album/album.service";
import { Album } from "@main/album/models/album.model";

import { AlbumArtService } from "@main/album-art/album-art.service";
import { AlbumArt } from "@main/album-art/models/album-art.model";

export type EventTypes = "add" | "addDir" | "change" | "unlink" | "unlinkDir";

export interface FileEvent {
    type: EventTypes;
    path: string;
}

export interface ExistingFileEvent extends FileEvent {
    music: Music;
}

export type EventMap = {
    [TType in EventTypes]: Array<TType extends "add" ? FileEvent : ExistingFileEvent>;
};

export class Scanner {
    private readonly albums: Album[] = [];
    private readonly updatedMusics: Music[] = [];
    private readonly albumLeadArtists: Map<Album["id"], Artist[]> = new Map();
    private readonly albumFeaturedArtists: Map<Album["id"], Artist[]> = new Map();
    private readonly albumArts: Map<Album["id"], AlbumArt[]> = new Map();

    public constructor(
        private readonly events: FileEvent[],
        private readonly musicService: MusicService,
        private readonly albumService: AlbumService,
        private readonly artistService: ArtistService,
        private readonly albumArtService: AlbumArtService,
    ) {}

    public async start() {
        const events = [...this.events];
        this.events.length = 0;

        const targetMusics = await this.musicService.getMusicsByPaths(
            events.map(item => item.path),
            true,
        );

        const eventMap: EventMap = {
            add: [],
            addDir: [],
            change: [],
            unlink: [],
            unlinkDir: [],
        };

        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            if (event.type === "add") {
                eventMap.add.push(event);
                continue;
            }

            const music = targetMusics[i];
            if (!music) {
                continue;
            }

            eventMap[event.type].push({ ...event, music });
        }

        const addedMusics: Music[] = [];
        for (const event of eventMap.add) {
            const addedMusic = await this.onFileAdded(event);
            addedMusics.push(addedMusic);
        }

        const removedMusicIds: Music["id"][] = [];
        for (const event of eventMap.unlink) {
            const musicId = await this.onFileRemoved(event);
            if (musicId) {
                removedMusicIds.push(musicId);
            }
        }

        for (const event of eventMap.change) {
            await this.onFileChanged(event);
        }

        let allAlbums = await this.albumService.findAll();
        const oldLeadArtistIds = _.uniq(allAlbums.flatMap(a => a.leadArtistIds));

        const updatedAlbums: Album[] = [];
        for (const { id } of this.albums) {
            const partialAlbum: DeepPartial<Album> = {};
            const leadArtists = this.albumLeadArtists.get(id);
            const featuredArtists = this.albumFeaturedArtists.get(id);
            const albumArts = this.albumArts.get(id);

            if (leadArtists) {
                partialAlbum.leadArtists = leadArtists;
            }

            if (featuredArtists) {
                partialAlbum.artists = featuredArtists;
            }

            if (albumArts) {
                partialAlbum.albumArts = albumArts;
            }

            const item = await this.albumService.update(id, partialAlbum);
            if (!item) {
                continue;
            }

            updatedAlbums.push(item);
            await this.albumService.publish("albumUpdated", item);
        }

        await this.musicService.publish(
            "musicsUpdated",
            await this.musicService.findByIds(this.updatedMusics.map(m => m.id)),
        );

        await this.musicService.publish("musicsRemoved", removedMusicIds);
        await this.musicService.publish("musicsAdded", addedMusics);
        await this.albumService.publish("albumsUpdated", updatedAlbums);

        allAlbums = await this.albumService.findAll();
        const newLeadArtistIds = _.uniq(allAlbums.flatMap(a => a.leadArtistIds));

        const leadArtistIdsAdded = _.difference(newLeadArtistIds, oldLeadArtistIds);
        const leadArtistIdsRemoved = _.difference(oldLeadArtistIds, newLeadArtistIds);

        if (leadArtistIdsAdded.length > 0) {
            const artists = await this.artistService.findByIds(leadArtistIdsAdded);
            for (const artist of artists) {
                await this.artistService.publish("leadArtistAdded", artist);
            }
        }

        if (leadArtistIdsRemoved.length > 0) {
            for (const id of leadArtistIdsRemoved) {
                await this.artistService.publish("leadArtistRemoved", id);
            }
        }
    }

    private attachAlbumData = async (album: Album, audio: Audio, featuredArtists: Artist[], albumArts: AlbumArt[]) => {
        const cachedLeadArtists = [...(this.albumLeadArtists.get(album.id) || [])];
        const leadArtists = audio.albumArtist
            ? await this.artistService.bulkEnsure(audio.albumArtist.split("\0"))
            : null;
        if (leadArtists) {
            cachedLeadArtists.push(...leadArtists);
            this.albumLeadArtists.set(album.id, _.uniqBy(cachedLeadArtists, "id"));
        }

        const newFeaturedArtists = [...(this.albumFeaturedArtists.get(album.id) || []), ...featuredArtists];
        this.albumFeaturedArtists.set(album.id, _.uniqBy(newFeaturedArtists, "id"));

        const newAlbumArts = [...(this.albumArts.get(album.id) || []), ...albumArts];
        this.albumArts.set(album.id, _.uniqBy(newAlbumArts, "id"));

        if (!this.albums.some(a => a.id === album.id)) {
            this.albums.push(album);
        }
    };

    private addUpdatedMusic = (music: Music) => {
        if (this.updatedMusics.some(m => m.id === music.id)) {
            return;
        }

        this.updatedMusics.push(music);
    };
    private removeUpdatedMusic = (music: Music) => {
        const index = this.updatedMusics.findIndex(m => m.id === music.id);
        if (index === -1) {
            return;
        }

        this.updatedMusics.splice(index, 1);
    };

    private onFileAdded = async ({ path }: FileEvent) => {
        const audio = Audio.fromFile(path);
        const [album, created] = audio.album ? await this.albumService.ensure(audio.album) : [];
        const albumArts = await this.albumArtService.bulkEnsure(audio.albumArts());
        const featuredArtists = await this.artistService.bulkEnsure(audio.artists);

        const music = await this.musicService.create(audio, path, albumArts, album, featuredArtists);
        if (music) {
            await this.musicService.publish("musicAdded", music);
        }

        if (album) {
            await this.attachAlbumData(album, audio, featuredArtists, albumArts);
            if (!created) {
                return music;
            }

            await this.albumService.publish("albumAdded", await this.albumService.findById(album.id));
            this.addUpdatedMusic(music);
        }

        return music;
    };
    private onFileChanged = async ({ music, path: targetPath }: ExistingFileEvent) => {
        const audio = Audio.fromFile(targetPath);
        const [album, created] = audio.album ? await this.albumService.ensure(audio.album) : [];
        const albumArts = await this.albumArtService.bulkEnsure(audio.albumArts());
        const featuredArtists = await this.artistService.bulkEnsure(audio.artists);
        const fileName = path.basename(targetPath);

        const updatedMusic = await this.musicService.update(music.id, {
            title: audio.title || fileName,
            albumArtist: audio.albumArtist,
            genre: audio.genre,
            year: audio.year,
            track: audio.track,
            disc: audio.disc,
            duration: audio.duration,
            path: targetPath,
            albumArts,
            album,
            artists: featuredArtists,
        });
        this.addUpdatedMusic(updatedMusic);

        if (music.albumId !== album?.id && music.albumId) {
            const oldAlbum = await this.albumService.findById(music.albumId);
            if (oldAlbum && oldAlbum.musicIds.length <= 0) {
                await this.albumService.delete(oldAlbum.id);
                await this.albumService.publish("albumDeleted", oldAlbum.id);
            }
        }

        if (album) {
            await this.attachAlbumData(album, audio, featuredArtists, albumArts);
            if (!created) {
                return;
            }

            await this.albumService.publish("albumAdded", await this.albumService.findById(album.id));
        }
    };
    private onFileRemoved = async ({ music }: ExistingFileEvent) => {
        await this.musicService.delete(music.id);
        await this.musicService.publish("musicRemoved", music.id);

        this.removeUpdatedMusic(music);

        if (music.albumId) {
            const album = await this.albumService.findById(music.albumId);
            if (album) {
                if (album.musicIds.length <= 0) {
                    await this.albumService.delete(album.id);
                    await this.albumService.publish("albumDeleted", album.id);
                } else {
                    await this.albumService.publish("albumUpdated", album);
                }
            }
        }

        return music.id;
    };
}
