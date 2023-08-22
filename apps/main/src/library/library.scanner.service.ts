import * as _ from "lodash";
import path from "path";
import { glob } from "fast-glob";
import { PubSub } from "graphql-subscriptions";
import mm from "music-metadata";

import { getMusicsPath } from "@async3619/merry-go-round";
import { Inject, Injectable } from "@nestjs/common";

import { MusicService } from "@music/music.service";

const LIBRARY_SCANNING_STATE_CHANGED = "LIBRARY_SCANNING_STATE_CHANGED";

@Injectable()
export class LibraryScannerService {
    private readonly pubSub = new PubSub();

    public constructor(@Inject(MusicService) private readonly musicService: MusicService) {}

    public async scanLibrary() {
        await this.pubSub.publish(LIBRARY_SCANNING_STATE_CHANGED, { libraryScanningStateChanged: true });

        await this.musicService.clear();

        const targetPaths = await this.getMediaFilePaths();
        for (const musicPath of targetPaths) {
            await this.processMusic(musicPath);
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

    private async processMusic(filePath: string) {
        const metadata = await mm.parseFile(filePath, { duration: true });
        let music = this.musicService.create(metadata, filePath);
        music = await this.musicService.save(music);

        return music;
    }

    public subscribeToLibraryScanningStateChanged() {
        return this.pubSub.asyncIterator(LIBRARY_SCANNING_STATE_CHANGED);
    }
}
