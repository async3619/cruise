import { Inject, Injectable } from "@nestjs/common";

import { MusicService } from "@music/music.service";
import { ArtistService } from "@artist/artist.service";
import { AlbumService } from "@album/album.service";

import { SearchSuggestion, SearchSuggestionType } from "@library/models/search-suggestion.model";

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
}
