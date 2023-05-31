import * as _ from "lodash";
import fs from "fs-extra";
import dayjs from "dayjs";
import stringSimilarity from "string-similarity";

import { AlbumArt as RawAlbumArt, Audio } from "@async3619/merry-go-round";

import { Inject, Injectable } from "@nestjs/common";

import { MusicService } from "@main/music/music.service";
import { AlbumService } from "@main/album/album.service";
import { ArtistService } from "@main/artist/artist.service";
import { ElectronService } from "@main/electron/electron.service";

import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";
import { Music } from "@main/music/models/music.model";

import { InjectHauntedClient } from "@main/haunted/haunted.decorator";
import type { HauntedClient } from "@main/haunted/haunted.module";

import { SearchResult } from "@main/library/models/search-result.dto";
import { SearchSuggestion, SearchSuggestionType } from "@main/library/models/search-suggestion.dto";

import { fetchUrlToBuffer } from "@main/utils/fetchUrlToBuffer";
import type { Nullable } from "@common/types";

@Injectable()
export class LibraryService {
    public constructor(
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(AlbumService) private readonly albumService: AlbumService,
        @Inject(ArtistService) private readonly artistService: ArtistService,
        @Inject(ElectronService) private readonly electronService: ElectronService,
        @InjectHauntedClient() private readonly client: HauntedClient,
    ) {}

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
}
