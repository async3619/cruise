import path from "path";
import _ from "lodash";
import { Audio } from "@async3619/merry-go-round";
import { DeepPartial } from "typeorm";

import { MusicService } from "@main/music/music.service";
import { Music } from "@main/music/models/music.model";
import { MUSIC_ADDED, MUSIC_REMOVED, MUSICS_UPDATED } from "@main/music/music.constants";

import { ArtistService } from "@main/artist/artist.service";
import { Artist } from "@main/artist/models/artist.model";

import { AlbumService } from "@main/album/album.service";
import { Album } from "@main/album/models/album.model";
import { ALBUM_ADDED, ALBUM_REMOVED, ALBUMS_UPDATED, ALBUM_UPDATED } from "@main/album/album.constants";

import { AlbumArtService } from "@main/album-art/album-art.service";
import { AlbumArt } from "@main/album-art/models/album-art.model";
import pubSub from "@main/pubsub";
import { LEAD_ARTIST_ADDED, LEAD_ARTIST_REMOVED } from "@main/artist/artist.constants";

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

        for (const event of eventMap.add) {
            await this.onFileAdded(event);
        }

        for (const event of eventMap.unlink) {
            await this.onFileRemoved(event);
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
            await pubSub.publish(ALBUM_UPDATED, {
                albumUpdated: item,
            });
        }

        await pubSub.publish(ALBUMS_UPDATED, {
            albumsUpdated: updatedAlbums,
        });
        await pubSub.publish(MUSICS_UPDATED, {
            musicsUpdated: this.musicService.findByIds(this.updatedMusics.map(m => m.id)),
        });

        allAlbums = await this.albumService.findAll();
        const newLeadArtistIds = _.uniq(allAlbums.flatMap(a => a.leadArtistIds));

        const leadArtistIdsAdded = _.difference(newLeadArtistIds, oldLeadArtistIds);
        const leadArtistIdsRemoved = _.difference(oldLeadArtistIds, newLeadArtistIds);

        if (leadArtistIdsAdded.length > 0) {
            const artists = await this.artistService.findByIds(leadArtistIdsAdded);
            for (const artist of artists) {
                await pubSub.publish(LEAD_ARTIST_ADDED, {
                    leadArtistAdded: artist,
                });
            }
        }

        if (leadArtistIdsRemoved.length > 0) {
            for (const id of leadArtistIdsRemoved) {
                await pubSub.publish(LEAD_ARTIST_REMOVED, {
                    leadArtistRemoved: id,
                });
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
            await pubSub.publish(MUSIC_ADDED, {
                musicAdded: music,
            });
        }

        if (album) {
            await this.attachAlbumData(album, audio, featuredArtists, albumArts);
            if (!created) {
                return;
            }

            await pubSub.publish(ALBUM_ADDED, {
                albumAdded: await this.albumService.findById(album.id),
            });

            this.addUpdatedMusic(music);
        }
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
                await pubSub.publish(ALBUM_REMOVED, {
                    albumRemoved: oldAlbum.id,
                });
            }
        }

        if (album) {
            await this.attachAlbumData(album, audio, featuredArtists, albumArts);
            if (!created) {
                return;
            }

            await pubSub.publish(ALBUM_ADDED, {
                albumAdded: await this.albumService.findById(album.id),
            });
        }
    };
    private onFileRemoved = async ({ music }: ExistingFileEvent) => {
        await this.musicService.delete(music.id);
        await pubSub.publish(MUSIC_REMOVED, {
            musicRemoved: music.id,
        });

        this.removeUpdatedMusic(music);

        if (music.albumId) {
            const album = await this.albumService.findById(music.albumId);
            if (album) {
                if (album.musicIds.length <= 0) {
                    await this.albumService.delete(album.id);
                    await pubSub.publish(ALBUM_REMOVED, {
                        albumRemoved: album.id,
                    });
                } else {
                    await pubSub.publish(ALBUM_UPDATED, {
                        albumUpdated: album,
                    });
                }
            }
        }
    };
}
