import * as _ from "lodash";
import dayjs from "dayjs";
import { compareTwoStrings } from "string-similarity";

import { AlbumArt as RawAlbumArt, Audio } from "@async3619/merry-go-round";

import { Inject, Injectable } from "@nestjs/common";
import { registerEnumType } from "@nestjs/graphql";

import { MusicService } from "@main/music/music.service";
import { AlbumService } from "@main/album/album.service";
import { ArtistService } from "@main/artist/artist.service";
import { ElectronService } from "@main/electron/electron.service";

import { Artist } from "@main/artist/models/artist.model";

import { InjectHauntedClient } from "@main/haunted/haunted.decorator";
import type { HauntedClient } from "@main/haunted/haunted.module";

import { SearchResult } from "@main/library/models/search-result.dto";

import { fetchUrlToBuffer } from "@main/utils/fetchUrlToBuffer";
import type { Nullable } from "@common/types";
import { SearchSuggestion } from "@main/library/models/search-suggestion.dto";
import { Music } from "@main/music/models/music.model";
import { Album } from "@main/album/models/album.model";

export enum SearchMode {
    All = "all",
    Artist = "artist",
    Album = "album",
    Music = "music",
}

registerEnumType(SearchMode, { name: "SearchMode" });

@Injectable()
export class LibraryService {
    public constructor(
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(AlbumService) private readonly albumService: AlbumService,
        @Inject(ArtistService) private readonly artistService: ArtistService,
        @Inject(ElectronService) private readonly electronService: ElectronService,
        @InjectHauntedClient() private readonly client: HauntedClient,
    ) {}

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

    public async searchArtistPortrait(artist: Artist) {
        const artists = [
            ...(await this.client().searchArtists.query({
                query: artist.name,
                limit: 5,
            })),
            ...(await this.client().searchArtists.query({
                query: artist.name,
                limit: 5,
                locale: this.electronService.getLocales()[0],
            })),
        ];

        const matchedArtist = _.filter(artists, artist => artist.name === artist.name)[0];
        if (!matchedArtist) {
            return null;
        }

        return matchedArtist.artistImages;
    }

    public async search(query: string, mode: SearchMode): Promise<SearchResult> {
        if (!query) {
            return {
                total: 0,
                artists: [],
                albums: [],
                musics: [],
            };
        }

        let matchedMusics: Music[] = [];
        if (mode === SearchMode.All || mode === SearchMode.Music) {
            matchedMusics = await this.musicService.search(query);
        }

        let matchedAlbums: Album[] = [];
        if (mode === SearchMode.All || mode === SearchMode.Album) {
            matchedAlbums = await this.albumService.search(query);
        }

        let matchedArtists: Artist[] = [];
        if (mode === SearchMode.All || mode === SearchMode.Artist) {
            matchedArtists = await this.artistService.search(query);
        }

        return {
            total: matchedMusics.length + matchedAlbums.length + matchedArtists.length,
            artists: matchedArtists,
            albums: matchedAlbums,
            musics: matchedMusics,
        };
    }
    public async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
        const musicSuggestions = await this.musicService.getSuggestions(query);
        const albumSuggestions = await this.albumService.getSuggestions(query);
        const artistSuggestions = await this.artistService.getSuggestions(query);

        return _.chain<SearchSuggestion>([])
            .concat(musicSuggestions, albumSuggestions, artistSuggestions)
            .orderBy(s => compareTwoStrings(s.name, query), "desc")
            .value();
    }
}
