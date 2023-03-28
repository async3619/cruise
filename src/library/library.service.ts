import * as _ from "lodash";
import glob from "fast-glob";
import * as path from "path";
import fs from "fs-extra";
import * as chokidar from "chokidar";

import { AlbumArt as RawAlbumArt, Audio } from "@async3619/merry-go-round";

import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { MusicService } from "@main/music/music.service";
import { AlbumService } from "@main/album/album.service";
import { ArtistService } from "@main/artist/artist.service";
import { AlbumArtService } from "@main/album-art/album-art.service";
import { ConfigService } from "@main/config/config.service";

import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";
import { Music } from "@main/music/models/music.model";

import { SCANNING_STATE_CHANGED } from "@main/library/library.constants";
import { FileEvent, Scanner } from "@main/library/utils/scanner.model";

import pubSub from "@main/pubsub";

@Injectable()
export class LibraryService implements OnModuleInit, OnModuleDestroy {
    private readonly watchers: chokidar.FSWatcher[] = [];
    private readonly eventBuffer: FileEvent[] = [];

    public constructor(
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(AlbumService) private readonly albumService: AlbumService,
        @Inject(ArtistService) private readonly artistService: ArtistService,
        @Inject(AlbumArtService) private readonly albumArtService: AlbumArtService,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {}

    public async onModuleInit() {
        const { libraryDirectories } = await this.configService.getConfig();
        for (const directoryPath of libraryDirectories) {
            const watcher = chokidar.watch("./**/*.mp3", {
                cwd: directoryPath,
            });

            watcher.on("all", this.onFileEvent.bind(this, directoryPath));
            this.watchers.push(watcher);
        }
    }
    public async onModuleDestroy() {
        for (const watcher of this.watchers) {
            await watcher.close();
        }
    }
    private onFileEvent(
        basePath: string,
        type: "add" | "addDir" | "change" | "unlink" | "unlinkDir",
        filePath: string,
    ) {
        this.eventBuffer.push({ type, path: path.join(basePath, filePath) });
        this.flushEventBuffer();
    }

    private flushEventBuffer = _.debounce(async () => {
        await pubSub.publish(SCANNING_STATE_CHANGED, {
            scanningStateChanged: true,
        });

        const scanner = new Scanner(
            this.eventBuffer,
            this.musicService,
            this.albumService,
            this.artistService,
            this.albumArtService,
        );

        await scanner.start();

        await pubSub.publish(SCANNING_STATE_CHANGED, {
            scanningStateChanged: false,
        });
    }, 500);

    public async needScan() {
        const musicCount = await this.musicService.count();
        const albumCount = await this.albumService.count();
        const albumArtCount = await this.albumArtService.count();
        const artistCount = await this.artistService.count();

        const { libraryDirectories } = await this.configService.getConfig();
        const musicFilePaths: string[] = [];
        for (const directory of libraryDirectories) {
            const paths = await glob("**/*.mp3", {
                cwd: directory,
            });

            const absolutePaths = paths.map(p => path.join(directory, p));
            musicFilePaths.push(...absolutePaths);
        }

        return (
            musicFilePaths.length > 0 &&
            musicCount === 0 &&
            albumCount === 0 &&
            albumArtCount === 0 &&
            artistCount === 0
        );
    }
    public async scan() {
        await pubSub.publish(SCANNING_STATE_CHANGED, {
            scanningStateChanged: true,
        });

        await this.musicService.clear();
        await this.albumService.clear();
        await this.albumArtService.clear();
        await this.artistService.clear();

        const { libraryDirectories } = await this.configService.getConfig();
        const musicFilePaths: string[] = [];
        for (const directory of libraryDirectories) {
            const paths = await glob("**/*.mp3", {
                cwd: directory,
            });

            const absolutePaths = paths.map(p => path.join(directory, p));
            musicFilePaths.push(...absolutePaths);
        }

        this.eventBuffer.push(
            ...musicFilePaths.map<FileEvent>(path => ({
                type: "add",
                path,
            })),
        );

        await this.flushEventBuffer();
    }

    public async updateTracks(target: Album): Promise<void>;
    public async updateTracks(target: Album): Promise<void> {
        let targetTracks: Music[] = [];
        let albumTitle: string | null = null;
        let albumArtists: Artist[] = [];
        let albumArts: AlbumArt[] = [];
        if (target instanceof Album) {
            const album = await this.albumService.findById(target.id, ["musics", "leadArtists", "albumArts"]);
            if (!album) {
                throw new Error("Album not found");
            }

            albumTitle = album.title;
            albumArtists = album.leadArtists;
            albumArts = album.albumArts;
            targetTracks = album.musics;
        }

        // check if all the track path is valid
        for (const track of targetTracks) {
            if (!fs.existsSync(track.path)) {
                throw new Error(`Target audio file '${track.path}' does not exist`);
            }

            const audio = Audio.fromFile(track.path);
            audio.genre = track.genre || "";
            audio.year = track.year || 0;
            audio.albumArtist = albumArtists.map(artist => artist.name).join("\0");

            if (albumTitle) {
                audio.album = albumTitle;
            }

            audio.clearAlbumArts();
            for (const albumArt of albumArts) {
                if (!fs.existsSync(albumArt.path)) {
                    throw new Error(`Target album art file '${albumArt.path}' does not exist`);
                }

                const albumArtItem = await RawAlbumArt.fromFile(albumArt.path);
                albumArtItem.type = albumArt.type as unknown as RawAlbumArt["type"];
                albumArtItem.description = albumArt.description;

                audio.addAlbumArt(albumArtItem);
            }

            audio.save(track.path);
        }
    }
}
