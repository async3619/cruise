import * as _ from "lodash";
import path from "path";
import { glob } from "fast-glob";
import { PubSub } from "graphql-subscriptions";
import mm from "music-metadata";

import { getMusicsPath } from "@async3619/merry-go-round";
import { Inject, Injectable } from "@nestjs/common";

import { MusicService } from "@music/music.service";
import { AlbumService } from "@album/album.service";
import { ImageService } from "@image/image.service";
import { AlbumArtService } from "@album-art/album-art.service";
import { ArtistService } from "@artist/artist.service";

import { Album } from "@album/models/album.model";
import { Artist } from "@artist/models/artist.model";
import { AlbumArt } from "@album-art/models/album-art.model";

const LIBRARY_SCANNING_STATE_CHANGED = "LIBRARY_SCANNING_STATE_CHANGED";

@Injectable()
export class LibraryScannerService {
    private readonly pubSub = new PubSub();

    public constructor(
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(AlbumService) private readonly albumService: AlbumService,
        @Inject(ArtistService) private readonly artistService: ArtistService,
        @Inject(ImageService) private readonly imageService: ImageService,
        @Inject(AlbumArtService) private readonly albumArtService: AlbumArtService,
    ) {}

    public async scanLibrary() {
        await this.pubSub.publish(LIBRARY_SCANNING_STATE_CHANGED, { libraryScanningStateChanged: true });
        await this.albumArtService.clear();
        await this.musicService.clear();
        await this.albumService.clear();
        await this.artistService.clear();

        const albumMap = new Map<string, Album>();
        const artistMap = new Map<string, Artist>();
        const targetPaths = await this.getMediaFilePaths();
        for (const musicPath of targetPaths) {
            await this.processMusic(musicPath, albumMap, artistMap);
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

    private async processMusic(filePath: string, albumMap: Map<string, Album>, artistMap: Map<string, Artist>) {
        const metadata = await mm.parseFile(filePath, { duration: true });
        let music = this.musicService.create(metadata, filePath);
        let albumArts: AlbumArt[] = [];
        for (const picture of metadata.common.picture ?? []) {
            const image = await this.imageService.ensure(picture, "album-arts");
            const albumArt = this.albumArtService.create(image, picture);

            albumArts.push(albumArt);
        }

        albumArts = await this.albumArtService.save(albumArts);
        music.albumArts = albumArts;

        const artists: Artist[] = [];
        for (const artistName of music.artistNames ?? []) {
            let artist = artistMap.get(artistName);
            if (!artist) {
                artist = this.artistService.create(artistName);
                artist = await this.artistService.save(artist);

                artistMap.set(artist.name, artist);
            }

            artists.push(artist);
        }

        music.artists = artists;
        music = await this.musicService.save(music);

        if (music.albumTitle) {
            let album = albumMap.get(music.albumTitle);
            if (!album) {
                album = this.albumService.create(music.albumTitle);
                album = await this.albumService.save(album);

                albumMap.set(album.title, album);
            }

            album.albumArts = _.uniqBy([...(album.albumArts ?? []), ...albumArts], "imageId");
            album.musics = [...(album.musics ?? []), music];
            album.artists = _.uniqBy([...(album.artists ?? []), ...artists], "id");
            album.artistNames = _.uniq([...(album.artistNames ?? []), ...(music.artistNames ?? [])]);
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
