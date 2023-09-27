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

        const matchedMusics = _.chain(musics)
            .filter(m => !!m.title?.includes(query))
            .value();

        const matchedArtists = _.chain(artists)
            .filter(a => !!a.name?.includes(query))
            .value();

        const matchedAlbums = _.chain(albums)
            .filter(a => !!a.title?.includes(query))
            .value();

        result.musics = matchedMusics;
        result.artists = matchedArtists;
        result.albums = matchedAlbums;

        return result;
    }
}
