import glob from "fast-glob";
import * as path from "path";

import { Audio } from "@async3619/merry-go-round";

import { Inject, Injectable, OnModuleInit } from "@nestjs/common";

import { MusicService } from "@main/music/music.service";
import { AlbumService } from "@main/album/album.service";
import { ArtistService } from "@main/artist/artist.service";
import { AlbumArtService } from "@main/album-art/album-art.service";

import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";

import { getConfig } from "@main/config";

@Injectable()
export class LibraryService implements OnModuleInit {
    public constructor(
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(AlbumService) private readonly albumService: AlbumService,
        @Inject(ArtistService) private readonly artistService: ArtistService,
        @Inject(AlbumArtService) private readonly albumArtService: AlbumArtService,
    ) {}

    public async onModuleInit() {
        await this.scan();
    }

    private getAlbumData(audio: Audio) {
        const albumName = audio.album;
        const artistName = audio.albumArtist || audio.artists.join(", ");
        const leadArtists: string[] = audio.albumArtist?.split("\0") || [];
        const featuredArtists: string[] = audio.artists;

        return {
            key: albumName && artistName ? `${albumName}:${artistName}` : null,
            name: albumName,
            leadArtists,
            artists: featuredArtists,
            allArtists: [...leadArtists, ...featuredArtists],
        };
    }

    public async scan() {
        const { libraryDirectories } = await getConfig();
        const musicFilePaths: string[] = [];
        for (const directory of libraryDirectories) {
            const paths = await glob("**/*.mp3", {
                cwd: directory,
            });

            const absolutePaths = paths.map(p => path.join(directory, p));
            musicFilePaths.push(...absolutePaths);
        }

        const audioMap: Record<string, Audio> = {};
        for (const filePath of musicFilePaths) {
            if (filePath in audioMap) {
                continue;
            }

            audioMap[filePath] = await Audio.fromFile(filePath);
        }

        // register all artists
        const allArtists: Record<string, Artist> = {};
        for (const audio of Object.values(audioMap)) {
            const artists = [...audio.artists, ...(audio.albumArtist?.split("\0") || [])];
            if (artists.length <= 0) {
                continue;
            }

            for (const artistName of artists) {
                if (artistName in allArtists) {
                    continue;
                }

                allArtists[artistName] = await this.artistService.create(artistName);
            }
        }

        // register all albums
        const allAlbums: Record<string, Album> = {};
        for (const audio of Object.values(audioMap)) {
            const albumData = this.getAlbumData(audio);
            if (!albumData) {
                continue;
            }

            const { key, name, leadArtists, artists } = albumData;
            if (!key || !name || key in allAlbums) {
                continue;
            }

            const featuredArtists = artists.map(artistName => allArtists[artistName]);
            const albumArtists = leadArtists.map(artistName => allArtists[artistName]);

            allAlbums[key] = await this.albumService.create(name, featuredArtists, albumArtists);
        }

        // register all album arts
        const allAlbumArts: Record<string, AlbumArt[]> = {};
        for (const [filePath, audio] of Object.entries(audioMap)) {
            const albumArts = audio.albumArts();
            if (albumArts.length <= 0) {
                continue;
            }

            allAlbumArts[filePath] ??= [];
            for (const rawAlbumArt of albumArts) {
                const albumArt = await this.albumArtService.create(rawAlbumArt);
                allAlbumArts[filePath].push(albumArt);
            }
        }

        // register all musics
        for (const [filePath, audio] of Object.entries(audioMap)) {
            const { key: albumKey, artists } = this.getAlbumData(audio);
            const album: Album | null = albumKey ? allAlbums[albumKey] : null;
            const featuredArtists = artists.map(artistName => allArtists[artistName]);

            await this.musicService.create(audio, filePath, allAlbumArts[filePath], album, featuredArtists);
        }
    }
}
