import * as _ from "lodash";
import glob from "fast-glob";
import * as path from "path";
import fs from "fs-extra";
import * as chokidar from "chokidar";
import dayjs from "dayjs";
import stringSimilarity from "string-similarity";

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

import { InjectHauntedClient } from "@main/haunted/haunted.decorator";
import type { HauntedClient } from "@main/haunted/haunted.module";

import { SCANNING_STATE_CHANGED } from "@main/library/library.constants";
import { FileEvent, Scanner } from "@main/library/utils/scanner.model";

import pubSub from "@main/pubsub";
import { Nullable } from "@common/types";
import { fetchUrlToBuffer } from "@main/utils/fetchUrlToBuffer";
import { SearchResult } from "@main/library/models/search-result.dto";
import { SearchSuggestion, SearchSuggestionType } from "@main/library/models/search-suggestion.dto";

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
        @InjectHauntedClient() private readonly client: HauntedClient,
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

    public async syncAlbumData(albumId: number, hauntedId: string, locale: Nullable<string>) {
        const client = this.client();
        const album = await client.album.query({
            id: hauntedId,
            locale: locale || undefined,
        });

        if (!album) {
            throw new Error(`Album information with the given id (${hauntedId}) does not exist`);
        }

        const targetAlbum = await this.albumService.findById(albumId, ["musics", "leadArtists", "albumArts"]);
        if (!targetAlbum) {
            throw new Error(`Target album with the given id (${albumId}) not found`);
        }

        let albumArt: RawAlbumArt | null = null;
        const largestAlbumArt = _.maxBy(album.albumArts, art => art.width || 0) || album.albumArts[0];
        if (largestAlbumArt) {
            const buffer = await fetchUrlToBuffer(largestAlbumArt.url);
            albumArt = await RawAlbumArt.fromBuffer(buffer);
        }

        for (const music of targetAlbum.musics) {
            const matchedTrack = album.tracks.find(track => track.track === music.track);
            if (!matchedTrack) {
                continue;
            }

            const audio = Audio.fromFile(music.path);
            audio.title = matchedTrack.title;
            audio.album = album.title;
            audio.track = matchedTrack.track;
            audio.disc = matchedTrack.disc;
            audio.year = dayjs(album.releaseDate, "YYYY-MM-DD").year();
            audio.artist = matchedTrack.artists.map(artist => artist.name).join("\0");
            audio.albumArtist = album.artists.map(artist => artist.name).join("\0");

            if (albumArt) {
                audio.clearAlbumArts();
                audio.addAlbumArt(albumArt);
            }

            audio.save(music.path);
        }

        return true;
    }

    private async getMatchedMedia(query: string): Promise<[Music[], Album[], Artist[]]> {
        const musics = await this.musicService.findAll();
        const albums = await this.albumService.findAll();
        const artists = await this.artistService.findLeadArtists();

        query = query.toLowerCase();

        const matchedMusics = musics.filter(music => music.title.toLowerCase().includes(query));
        const matchedAlbums = albums.filter(album => album.title.toLowerCase().includes(query));
        const matchedArtists = artists.filter(artist => artist.name.toLowerCase().includes(query));

        return [matchedMusics, matchedAlbums, matchedArtists];
    }

    public async search(query: string): Promise<SearchResult> {
        const [matchedMusics, matchedAlbums, matchedArtists] = await this.getMatchedMedia(query);

        return {
            total: matchedMusics.length + matchedAlbums.length + matchedArtists.length,
            artists: matchedArtists,
            albums: matchedAlbums,
            musics: matchedMusics,
        };
    }
    public async getSearchSuggestions(query: string, limit: number): Promise<SearchSuggestion[]> {
        const [matchedMusics, matchedAlbums, matchedArtists] = await this.getMatchedMedia(query);
        const allItems = [...matchedMusics, ...matchedAlbums, ...matchedArtists];
        const similarities = allItems.map<SearchSuggestion & { similarity: number }>(item => {
            let name: string;
            if ("name" in item) {
                name = item.name;
            } else {
                name = item.title;
            }

            let type: SearchSuggestionType;
            if (item instanceof Music) {
                type = SearchSuggestionType.Music;
            } else if (item instanceof Album) {
                type = SearchSuggestionType.Album;
            } else {
                type = SearchSuggestionType.Artist;
            }

            return {
                id: item.id,
                type,
                name,
                similarity: stringSimilarity.compareTwoStrings(query, name),
            };
        });

        return _.orderBy(similarities, ["similarity"], ["desc"]).slice(0, limit);
    }
}
