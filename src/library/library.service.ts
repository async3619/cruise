import * as _ from "lodash";
import glob from "fast-glob";
import * as path from "path";
import fs from "fs-extra";

import { AlbumArt as RawAlbumArt, Audio } from "@async3619/merry-go-round";

import { Inject, Injectable } from "@nestjs/common";

import { MusicService } from "@main/music/music.service";
import { AlbumService } from "@main/album/album.service";
import { ArtistService } from "@main/artist/artist.service";
import { AlbumArtService } from "@main/album-art/album-art.service";

import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";
import { Music } from "@main/music/models/music.model";

import { getConfig } from "@main/config";

@Injectable()
export class LibraryService {
    public constructor(
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(AlbumService) private readonly albumService: AlbumService,
        @Inject(ArtistService) private readonly artistService: ArtistService,
        @Inject(AlbumArtService) private readonly albumArtService: AlbumArtService,
    ) {}

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

    public async needScan() {
        const musicCount = await this.musicService.count();
        const albumCount = await this.albumService.count();
        const albumArtCount = await this.albumArtService.count();
        const artistCount = await this.artistService.count();

        const { libraryDirectories } = await getConfig();
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
        await this.musicService.clear();
        await this.albumService.clear();
        await this.albumArtService.clear();
        await this.artistService.clear();

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

        // register all album arts
        const allAlbumArts: Record<string, AlbumArt[]> = {};
        for (const [filePath, audio] of Object.entries(audioMap)) {
            allAlbumArts[filePath] ??= [];

            const albumArts = audio.albumArts();
            if (albumArts.length <= 0) {
                continue;
            }

            for (const rawAlbumArt of albumArts) {
                const albumArt = await this.albumArtService.ensure(rawAlbumArt);
                allAlbumArts[filePath].push(albumArt);
            }
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
        const albumArtistMap: Record<string, Artist[]> = {};
        const featuredArtistMap: Record<string, Artist[]> = {};
        const albumKeys: [key: string, title: string][] = [];
        for (const audio of Object.values(audioMap)) {
            const albumData = this.getAlbumData(audio);
            if (!albumData) {
                continue;
            }

            const { key, name, leadArtists, artists } = albumData;
            if (!key || !name) {
                continue;
            }

            const featuredArtists = artists.map(artistName => allArtists[artistName]);
            const albumArtists = leadArtists.map(artistName => allArtists[artistName]);

            albumArtistMap[key] = [...(albumArtistMap[key] || []), ...albumArtists];
            featuredArtistMap[key] = [...(featuredArtistMap[key] || []), ...featuredArtists];
            albumKeys.push([key, name]);
        }

        const allAlbums: Record<string, Album> = {};
        for (const [key, title] of albumKeys) {
            if (key in allAlbums) {
                continue;
            }

            let albumArtists = albumArtistMap[key];
            let featuredArtists = featuredArtistMap[key];
            if (!albumArtists || !featuredArtists) {
                continue;
            }

            albumArtists = _.uniqBy(albumArtists, artist => artist.name);
            featuredArtists = _.uniqBy(featuredArtists, artist => artist.name);

            allAlbums[key] = await this.albumService.create(title, featuredArtists, albumArtists);
        }

        // register all musics
        const albumArtMap = new Map<Album, AlbumArt[]>();
        for (const [filePath, audio] of Object.entries(audioMap)) {
            const { key: albumKey, artists } = this.getAlbumData(audio);
            const album: Album | null = albumKey ? allAlbums[albumKey] : null;
            const featuredArtists = artists.map(artistName => allArtists[artistName]);

            await this.musicService.create(audio, filePath, allAlbumArts[filePath], album, featuredArtists);

            if (album) {
                albumArtMap.set(album, [...(albumArtMap.get(album) || []), ...allAlbumArts[filePath]]);
            }
        }

        // link all album arts to albums
        for (const [album, albumArtsItem] of albumArtMap.entries()) {
            const albumArts = _.chain(albumArtsItem)
                .flatten()
                .uniqBy(p => p.id)
                .value();

            await this.albumService.setAlbumArts(album.id, albumArts);
        }
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
