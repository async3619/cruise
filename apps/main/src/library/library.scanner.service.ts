import * as _ from "lodash";
import path from "path";
import { glob } from "fast-glob";
import { PubSub } from "graphql-subscriptions";
import mm from "music-metadata";

import { getMusicsPath } from "@async3619/merry-go-round";
import { Inject, Injectable } from "@nestjs/common";

import { MusicService } from "@music/music.service";
import { AlbumService } from "@album/album.service";

import { Album } from "@album/models/album.model";

const LIBRARY_SCANNING_STATE_CHANGED = "LIBRARY_SCANNING_STATE_CHANGED";

@Injectable()
export class LibraryScannerService {
    private readonly pubSub = new PubSub();

    public constructor(
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(AlbumService) private readonly albumService: AlbumService,
    ) {}

    public async scanLibrary() {
        await this.pubSub.publish(LIBRARY_SCANNING_STATE_CHANGED, { libraryScanningStateChanged: true });
        await this.musicService.clear();
        await this.albumService.clear();

        const albumMap = new Map<string, Album>();
        const targetPaths = await this.getMediaFilePaths();
        for (const musicPath of targetPaths) {
            await this.processMusic(musicPath, albumMap);
        }

        await this.pubSub.publish(LIBRARY_SCANNING_STATE_CHANGED, { libraryScanningStateChanged: false });
    }

    public async getMediaFilePaths() {
        const result: string[] = [];
        const musicDirectories = _.compact([getMusicsPath()]);
        for (const directory of musicDirectories) {
            const paths = await glob("./**/*.mp3", { cwd: directory, onlyFiles: true });
            for (const filePath of paths) {
                result.push(path.join(directory, filePath));
            }
        }

        return result;
    }

    private async processMusic(filePath: string, albumMap: Map<string, Album>) {
        const metadata = await mm.parseFile(filePath, { duration: true });
        let music = this.musicService.create(metadata, filePath);
        music = await this.musicService.save(music);

        if (music.albumTitle) {
            let album = albumMap.get(music.albumTitle);
            if (!album) {
                album = this.albumService.create(music.albumTitle);
                album = await this.albumService.save(album);

                albumMap.set(album.title, album);
            }

            album.musics = [...(album.musics ?? []), music];
            album.artists = _.uniq([...(album.artists ?? []), ...(music.artists ?? [])]);
            album.albumArtists = _.chain([...(album.albumArtists ?? []), music.albumArtist])
                .compact()
                .uniq()
                .value();

            album = await this.albumService.save(album);
            albumMap.set(album.title, album);
        }

        return music;
    }

    public subscribeToLibraryScanningStateChanged() {
        return this.pubSub.asyncIterator(LIBRARY_SCANNING_STATE_CHANGED);
    }
}
