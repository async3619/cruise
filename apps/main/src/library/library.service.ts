import _ from "lodash";

import { Inject, Injectable } from "@nestjs/common";

import { MusicService } from "@music/music.service";
import { ArtistService } from "@artist/artist.service";
import { AlbumService } from "@album/album.service";

import { SearchSuggestion, SearchSuggestionType } from "@library/models/search-suggestion.model";
import { SearchResult } from "@library/models/search-result.model";

@Injectable()
export class LibraryService {
    public constructor(
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(ArtistService) private readonly artistService: ArtistService,
        @Inject(AlbumService) private readonly albumService: AlbumService,
    ) {}

    public async getSearchSuggestions(): Promise<SearchSuggestion[]> {
        const musics = await this.musicService.findAll();
        const artists = await this.artistService.findAll();
        const albums = await this.albumService.findAll();

        return [
            ...musics
                .map(music => ({ id: music.id, title: music.title, type: SearchSuggestionType.Music }))
                .filter((item): item is SearchSuggestion => Boolean(item.title)),
            ...artists.map(artist => ({ id: artist.id, title: artist.name, type: SearchSuggestionType.Artist })),
            ...albums.map(album => ({ id: album.id, title: album.title, type: SearchSuggestionType.Album })),
        ];
    }

    public async search(query: string) {
        const result = new SearchResult();
        const musics = await this.musicService.findAll();
        const artists = await this.artistService.findAll();
        const albums = await this.albumService.findAll();

        const musicMap = _.chain(musics).keyBy("id").mapValues().value();
        const artistMap = _.chain(artists).keyBy("id").mapValues().value();
        const albumMap = _.chain(albums).keyBy("id").mapValues().value();

        query = query.toLowerCase();

        const matchedMusics = _.chain(musics)
            .filter(m => !!m.title?.toLowerCase()?.includes(query))
            .value();

        const matchedArtists = _.chain(artists)
            .filter(a => !!a.name?.toLowerCase()?.includes(query))
            .value();

        const matchedAlbums = _.chain(albums)
            .filter(a => !!a.title?.toLowerCase()?.includes(query))
            .value();

        for (const album of matchedAlbums) {
            matchedMusics.push(
                ..._.chain(album.musicIds)
                    .map(id => musicMap[id])
                    .value(),
            );
        }

        for (const artist of matchedArtists) {
            matchedAlbums.push(
                ..._.chain(artist.albumIds)
                    .map(id => albumMap[id])
                    .value(),
            );

            matchedMusics.push(
                ..._.chain(artist.musicIds)
                    .map(id => musicMap[id])
                    .value(),
            );
        }

        for (const music of matchedMusics) {
            matchedArtists.push(
                ..._.chain(music.artistIds)
                    .map(id => artistMap[id])
                    .value(),
            );

            if (music.albumId) {
                matchedAlbums.push(albumMap[music.albumId]);
            }
        }

        result.musics = _.chain(matchedMusics).uniqBy("id").value();
        result.artists = _.chain(matchedArtists).uniqBy("id").value();
        result.albums = _.chain(matchedAlbums).uniqBy("id").value();

        return result;
    }
}
