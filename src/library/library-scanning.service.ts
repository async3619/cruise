import _ from "lodash";
import nsfw from "nsfw";
import * as path from "path";
import * as fs from "fs-extra";
import glob from "fast-glob";

import { Audio } from "@async3619/merry-go-round";

import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { PubSubService } from "@main/common/pubsub.service";
import { MusicService } from "@main/music/music.service";
import { AlbumService } from "@main/album/album.service";
import { ArtistService } from "@main/artist/artist.service";
import { ConfigService } from "@main/config/config.service";
import { Album } from "@main/album/models/album.model";
import { AlbumArtService } from "@main/album-art/album-art.service";
import { Music } from "@main/music/models/music.model";
import { mergeWatcherResult } from "@main/utils/mergeWatcherResult";
import { PlaylistService } from "@main/playlist/playlist.service";

interface LibraryScanningPubSub {
    scanningStateChanged: boolean;
}

export interface WatcherEventResult {
    newEvents?: nsfw.FileChangeEvent[];

    createdAlbumIds?: number[];
    createdMusicIds?: number[];
    createdArtistIds?: number[];

    updatedAlbumIds?: number[];
    updatedMusicIds?: number[];
    updatedArtistIds?: number[];

    deletedMusicIds?: number[];
    deletedAlbumIds?: number[];
}

export enum ObjectState {
    Created,
    Updated,
    Deleted,
}

@Injectable()
export class LibraryScanningService
    extends PubSubService<LibraryScanningPubSub>
    implements OnModuleInit, OnModuleDestroy
{
    private readonly watchers: nsfw.NSFW[] = [];
    private readonly eventQueue: nsfw.FileChangeEvent[] = [];

    private scanning = false;

    public constructor(
        @Inject(ConfigService) private readonly configService: ConfigService,
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(AlbumService) private readonly albumService: AlbumService,
        @Inject(ArtistService) private readonly artistService: ArtistService,
        @Inject(AlbumArtService) private readonly albumArtService: AlbumArtService,
        @Inject(PlaylistService) private readonly playlistService: PlaylistService,
    ) {
        super();
    }

    public async onModuleInit(): Promise<void> {
        await this.startWatch();
    }
    public async onModuleDestroy(): Promise<void> {
        await this.stopWatch();
    }

    private async onFileChangeEvent(events: nsfw.FileChangeEvent[]) {
        this.eventQueue.push(...events);
        this.flushEventQueue();
    }
    private async onFileCreated({ directory, file }: nsfw.CreatedFileEvent): Promise<WatcherEventResult> {
        const targetPath = path.join(directory, file);
        const isDirectory = fs.lstatSync(targetPath).isDirectory();
        if (isDirectory) {
            const musicFilePaths = await glob("./**/*.mp3", {
                cwd: targetPath,
            });

            const newEvents: nsfw.FileChangeEvent[] = [];
            for (let musicFilePath of musicFilePaths) {
                musicFilePath = path.join(targetPath, musicFilePath);

                newEvents.push({
                    action: nsfw.ActionType.CREATED,
                    directory: path.dirname(musicFilePath),
                    file: path.basename(musicFilePath),
                });
            }

            return { newEvents };
        }

        let music: Music | null = await this.musicService.findByPath(targetPath);
        if (music) {
            return {};
        }

        const { audio, albumArts, album, featuredArtists, leadArtists, result, createdArtists, updatedArtists } =
            await this.loadFromFile(targetPath);

        music = await this.musicService.create(audio, targetPath, albumArts, album, featuredArtists, leadArtists);
        result.createdMusicIds = [music.id];
        result.createdArtistIds = createdArtists.map(artist => artist.id);
        result.updatedArtistIds = updatedArtists.map(artist => artist.id);

        return result;
    }
    private async onFileDeleted(event: nsfw.DeletedFileEvent): Promise<WatcherEventResult> {
        const targetPath = path.join(event.directory, event.file);
        const oldMusics = await this.musicService.findByDirectory(targetPath);
        const affectedMusicIds: number[] = [];
        const affectedAlbumIds: number[] = [];

        if (oldMusics.length) {
            affectedAlbumIds.push(..._.chain(oldMusics).map("albumId").compact().value());
            affectedMusicIds.push(..._.map(oldMusics, "id"));
        } else {
            const oldMusic = await this.musicService.findByPath(targetPath);
            if (oldMusic) {
                affectedMusicIds.push(oldMusic.id);
            }

            if (oldMusic?.albumId) {
                affectedAlbumIds.push(oldMusic.albumId);
            }
        }

        if (affectedMusicIds.length > 0) {
            await this.playlistService.deleteMusics(affectedMusicIds);
            await this.musicService.delete(affectedMusicIds);
        }

        const result: WatcherEventResult = {};
        if (affectedAlbumIds.length > 0) {
            const targetAlbumIds = _.uniq(affectedAlbumIds);
            for (const albumId of targetAlbumIds) {
                const [album, albumState] = await this.updateAlbum(albumId);
                if (albumState === ObjectState.Deleted) {
                    result.deletedAlbumIds ??= [];
                    result.deletedAlbumIds.push(albumId);
                    continue;
                }

                result.updatedAlbumIds ??= [];
                result.updatedAlbumIds.push(album.id);
            }
        }

        return {
            ...result,
            deletedMusicIds: affectedMusicIds,
        };
    }
    private async onFileModified(event: nsfw.ModifiedFileEvent): Promise<WatcherEventResult> {
        const targetPath = path.join(event.directory, event.file);
        const isDirectory = fs.lstatSync(targetPath).isDirectory();
        if (isDirectory) {
            return {};
        }

        let music = await this.musicService.findByPath(targetPath, ["artists", "albumArtists", "album"]);
        if (!music) {
            return {};
        }

        const { audio, albumArts, album, featuredArtists, leadArtists, result, createdArtists, updatedArtists } =
            await this.loadFromFile(targetPath);
        const oldAlbum = music.album;

        music = await this.musicService.update(music.id, {
            title: audio.title ?? music.title,
            genre: audio.genre,
            year: audio.year,
            track: audio.track,
            disc: audio.disc,
            duration: audio.duration,
            album,
            albumArts,
            artists: featuredArtists,
            albumArtists: leadArtists,
        });

        if (oldAlbum) {
            const [updatedAlbum, albumState, updatedArtistIds] = await this.updateAlbum(oldAlbum.id);
            if (albumState === ObjectState.Deleted) {
                result.deletedAlbumIds ??= [];
                result.deletedAlbumIds.push(oldAlbum.id);

                result.updatedArtistIds ??= [];
                result.updatedArtistIds.push(...updatedArtistIds);
            } else {
                result.updatedAlbumIds ??= [];
                result.updatedAlbumIds.push(updatedAlbum.id);
            }
        }

        return {
            ...result,
            updatedMusicIds: [music.id],
            createdArtistIds: createdArtists.map(artist => artist.id),
            updatedArtistIds: updatedArtists.map(artist => artist.id),
        };
    }
    private async onFileRenamed(event: nsfw.RenamedFileEvent): Promise<WatcherEventResult> {
        const oldPath = path.join(event.directory, event.oldFile);
        const newPath = path.join(event.directory, event.newFile);
        const isDirectory = fs.lstatSync(newPath).isDirectory();
        const affectedMusics: Music[] = [];

        if (isDirectory) {
            const musics = await this.musicService.findByDirectory(oldPath);
            for (const music of musics) {
                await this.musicService.update(music.id, {
                    path: path.join(newPath, path.basename(music.path)),
                });

                affectedMusics.push(music);
            }
        } else {
            const music = await this.musicService.findByPath(oldPath);
            if (!music) {
                return {};
            }

            await this.musicService.update(music.id, {
                path: newPath,
            });

            affectedMusics.push(music);
        }

        return {
            updatedMusicIds: affectedMusics.map(music => music.id),
        };
    }

    private async flushEventResult(result: WatcherEventResult) {
        const {
            createdMusicIds,
            createdAlbumIds,
            updatedMusicIds,
            updatedAlbumIds,
            deletedMusicIds,
            deletedAlbumIds,
            createdArtistIds,
            updatedArtistIds,
        } = result;

        if (createdMusicIds?.length) {
            const musics = await this.musicService.findByIds(createdMusicIds);
            await this.musicService.publish("musicsAdded", musics);
        }

        if (createdAlbumIds?.length) {
            const albums = await this.albumService.findByIds(createdAlbumIds);
            await this.albumService.publish("albumsAdded", albums);
        }

        if (createdArtistIds?.length || updatedArtistIds?.length) {
            await this.artistService.publish("artistsDataUpdated", true);
        }

        if (updatedMusicIds?.length) {
            const musics = await this.musicService.findByIds(updatedMusicIds);
            await this.musicService.publish("musicsUpdated", musics);
        }

        if (updatedAlbumIds?.length) {
            const albums = await this.albumService.findByIds(updatedAlbumIds);
            await this.albumService.publish("albumsUpdated", albums);

            for (const album of albums) {
                await this.albumService.publish("albumUpdated", album);
            }
        }

        if (deletedMusicIds?.length) {
            await this.musicService.publish("musicsRemoved", deletedMusicIds);
        }

        if (deletedAlbumIds?.length) {
            await this.albumService.publish("albumsRemoved", deletedAlbumIds);
        }
    }
    private flushEventQueue = _.debounce(async () => {
        this.setScanningState(true);
        const events = [...this.eventQueue];
        this.eventQueue.length = 0;

        let globalResult: WatcherEventResult = {};
        for (let i = 0; i < events.length; i++) {
            const event = events[i];

            let result: WatcherEventResult;
            switch (event.action) {
                case nsfw.ActionType.CREATED:
                    result = await this.onFileCreated(event);
                    break;

                case nsfw.ActionType.DELETED:
                    result = await this.onFileDeleted(event);
                    break;

                case nsfw.ActionType.MODIFIED:
                    result = await this.onFileModified(event);
                    break;

                case nsfw.ActionType.RENAMED:
                    result = await this.onFileRenamed(event);
                    break;
            }

            if (result?.newEvents) {
                events.push(...result.newEvents);
            }

            globalResult = mergeWatcherResult(globalResult, result);

            if (i % 10 === 0) {
                await this.flushEventResult(globalResult);
                globalResult = {};
            }
        }

        await this.flushEventResult(globalResult);
        this.setScanningState(false);
    }, 1000);

    public async needScan(): Promise<boolean> {
        const targetPaths = await this.getAllMusicFiles();
        if (targetPaths.length === 0) {
            return false;
        }

        const musics = await this.musicService.findAll();
        if (musics.length !== targetPaths.length) {
            return true;
        }

        return musics.some(music => !targetPaths.includes(music.path));
    }
    public async scan(): Promise<boolean> {
        const targetPaths = await this.getAllMusicFiles();
        const events: nsfw.CreatedFileEvent[] = targetPaths.map(targetPath => ({
            action: nsfw.ActionType.CREATED,
            directory: path.dirname(targetPath),
            file: path.basename(targetPath),
        }));

        this.eventQueue.push(...events);
        this.flushEventQueue();
        return false;
    }

    private setScanningState(scanning: boolean) {
        this.publish("scanningStateChanged", scanning);
        this.scanning = scanning;
    }
    private async getAllMusicFiles() {
        const { libraryDirectories } = await this.configService.getConfig();
        const targetPaths: string[] = [];

        for (const libraryDirectory of libraryDirectories) {
            const musicPaths = await glob("./**/*.mp3", {
                cwd: libraryDirectory,
            });

            targetPaths.push(...musicPaths.map(musicPath => path.join(libraryDirectory, musicPath)));
        }

        return targetPaths;
    }

    public async startWatch() {
        const { libraryDirectories } = await this.configService.getConfig();
        for (const libraryDirectory of libraryDirectories) {
            const watcher = await nsfw(libraryDirectory, this.onFileChangeEvent.bind(this));
            await watcher.start();

            this.watchers.push(watcher);
        }
    }
    public async stopWatch() {
        for (const watcher of this.watchers) {
            await watcher.stop();
        }

        this.watchers.length = 0;
    }

    private async updateAlbum(albumId: number): Promise<[Album, ObjectState, number[]]> {
        const album = await this.albumService.findById(albumId);
        if (album.musicIds.length === 0) {
            await this.albumService.delete(album.id);
            return [album, ObjectState.Deleted, album.leadArtistIds];
        }

        const musics = await this.musicService.findByIds(album.musicIds, ["artists", "albumArtists"]);
        const featuredArtists = _.chain(musics).flatMap("artists").uniqBy("id").value();
        const leadArtists = _.chain(musics).flatMap("albumArtists").uniqBy("id").value();

        await this.albumService.update(album.id, {
            artists: featuredArtists,
            leadArtists,
        });

        return [album, ObjectState.Updated, []];
    }
    private async loadFromFile(targetPath: string) {
        const result: WatcherEventResult = {};
        const audio = Audio.fromFile(targetPath);
        const albumArts = await this.albumArtService.bulkEnsure(audio.albumArts());

        const allArtistNames = audio.artists.concat(audio.albumArtist ?? []);
        const artists = await this.artistService.bulkEnsure(allArtistNames);
        const allArtists = _.chain(artists).map("item").value();
        const featuredArtists = _.intersectionWith(allArtists, audio.artists, (a, b) => a.name === b);
        const leadArtists = audio.albumArtist
            ? _.intersectionWith(allArtists, [audio.albumArtist], (a, b) => a.name === b)
            : featuredArtists;

        let album: Album | null = null;
        if (audio.album) {
            const { created, item } = await this.albumService.ensure(audio.album);

            if (created) {
                album = await this.albumService.update(item.id, {
                    artists: featuredArtists,
                    leadArtists,
                    albumArts,
                });
                result.createdAlbumIds = [item.id];
            } else {
                album = item;
                result.updatedAlbumIds = [item.id];
            }
        }

        const createdArtists = _.chain(artists).filter("created").map("item").value();
        const updatedArtists = _.chain(artists).map("item").differenceBy(createdArtists, "id").value();

        return {
            result,
            audio,
            albumArts,
            featuredArtists,
            leadArtists,
            album,
            createdArtists,
            updatedArtists,
        };
    }
}
