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

            console.log(event);

            const music = targetMusics[i];
            if (!music) {
                continue;
            }

            eventMap[event.type].push({ ...event, music });
        }

        for (const event of eventMap.add) {
            await this.onFileAdded(event);
        }

        for (const event of eventMap.unlink) {
            await this.onFileRemoved(event);
        }

        for (const event of eventMap.change) {
            await this.onFileChanged(event);
        }

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

            await this.albumService.update(id, partialAlbum);
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

        this.albums.push(album);
    };

    private onFileAdded = async ({ path }: FileEvent) => {
        const audio = Audio.fromFile(path);
        const album = audio.album ? await this.albumService.ensure(audio.album) : null;
        const albumArts = await this.albumArtService.bulkEnsure(audio.albumArts());
        const featuredArtists = await this.artistService.bulkEnsure(audio.artists);

        await this.musicService.create(audio, path, albumArts, album, featuredArtists);

        if (album) {
            await this.attachAlbumData(album, audio, featuredArtists, albumArts);
        }
    };

    private onFileRemoved = async ({ music }: ExistingFileEvent) => {
        await this.musicService.delete(music.id);

        if (music.albumId) {
            const album = await this.albumService.findById(music.albumId);
            if (album && album.musicIds.length <= 0) {
                await this.albumService.delete(album.id);
            }
        }
    };

    private onFileChanged = async ({ music, path: targetPath }: ExistingFileEvent) => {
        const audio = Audio.fromFile(targetPath);
        const album = audio.album ? await this.albumService.ensure(audio.album) : null;
        const albumArts = await this.albumArtService.bulkEnsure(audio.albumArts());
        const featuredArtists = await this.artistService.bulkEnsure(audio.artists);
        const fileName = path.basename(targetPath);

        await this.musicService.update(music.id, {
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

        if (music.albumId !== album?.id && music.albumId) {
            const oldAlbum = await this.albumService.findById(music.albumId);
            if (oldAlbum && oldAlbum.musicIds.length <= 0) {
                await this.albumService.delete(oldAlbum.id);
            }
        }

        if (album) {
            await this.attachAlbumData(album, audio, featuredArtists, albumArts);
        }
    };
}
