import * as _ from "lodash";
import { In, Repository } from "typeorm";

import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Artist } from "@main/artist/models/artist.model";

import { AlbumService } from "@main/album/album.service";
import { LibraryService } from "@main/library/library.service";
import { AlbumArtService } from "@main/album-art/album-art.service";
import { SearchSuggestion, SearchSuggestionType } from "@main/library/models/search-suggestion.dto";

import { BaseService } from "@main/common/base.service";
import { Searchable } from "@main/common/searchable.interface";

import { EnsureResult } from "@main/utils/types";

interface ArtistPubSub {
    artistPortraitAdded: Artist;
    artistsDataUpdated: boolean;
}

@Injectable()
export class ArtistService extends BaseService<Artist, ArtistPubSub> implements Searchable<Artist> {
    public constructor(
        @InjectRepository(Artist) private readonly artistRepository: Repository<Artist>,
        @Inject(forwardRef(() => AlbumService)) private readonly albumService: AlbumService,
        @Inject(forwardRef(() => LibraryService)) private readonly libraryService: LibraryService,
        @Inject(AlbumArtService) private readonly albumArtService: AlbumArtService,
    ) {
        super(artistRepository, Artist);
    }

    public async findLeadArtists() {
        const albums = await this.albumService.findAll();
        const artistIds = _.chain(albums).map("leadArtistIds").flatten().uniq().value();

        return this.findByIds(artistIds);
    }

    public async fetchPortrait(artist: Artist) {
        const targetArtist = await this.findById(artist.id);
        if (!targetArtist) {
            throw new Error("Artist with given id does not exist.");
        }

        const portrait = await this.libraryService.searchArtistPortrait(artist);
        if (!portrait) {
            return;
        }

        const largestPortrait = _.maxBy(portrait, "width");
        if (!largestPortrait) {
            return;
        }

        const albumArt = await this.albumArtService.createFromUrl(largestPortrait.url);
        if (!albumArt) {
            return;
        }

        targetArtist.portrait = albumArt;
        await this.artistRepository.save(targetArtist);

        this.publish("artistPortraitAdded", targetArtist);
    }

    public async create(name: string) {
        const artist = this.artistRepository.create();
        artist.name = name;

        return this.artistRepository.save(artist);
    }

    public async bulkEnsure(names: string[]): Promise<EnsureResult<Artist>[]> {
        names = _.uniq(names);
        const artists = await this.artistRepository.find({
            where: { name: In(names) },
        });

        const existingNames = artists.map(artist => artist.name);
        const newNames = _.difference(names, existingNames);

        const newArtists: EnsureResult<Artist>[] = [];
        for (const name of newNames) {
            const artist = this.artistRepository.create();
            artist.name = name;

            const item = await this.artistRepository.save(artist);
            newArtists.push({ created: true, item });
        }

        return [...artists.map(artist => ({ created: false, item: artist })), ...newArtists];
    }

    public async search(query: string): Promise<Artist[]> {
        const artistIdsByAlbum = await this.artistRepository
            .createQueryBuilder("a")
            .select("a.id", "id")
            .leftJoin("albums_artists_artists", "b", "a.id = b.artistsId")
            .leftJoin("albums", "c", "b.albumsId = c.id")
            .where("c.title LIKE :query", { query: `%${query}%` })
            .orWhere("a.name LIKE :query", { query: `%${query}%` })
            .getRawMany<{ id: string }>()
            .then(results => results.map(result => result.id))
            .then(ids => ids.map(id => parseInt(`${id}`, 10)));

        const artistIdsByMusic = await this.artistRepository
            .createQueryBuilder("a")
            .select("a.id", "id")
            .leftJoin("musics_artists_artists", "b", "a.id = b.artistsId")
            .leftJoin("musics", "c", "b.musicsId = c.id")
            .where("c.title LIKE :query", { query: `%${query}%` })
            .orWhere("a.name LIKE :query", { query: `%${query}%` })
            .getRawMany<{ id: string }>()
            .then(results => results.map(result => result.id))
            .then(ids => ids.map(id => parseInt(`${id}`, 10)));

        const artistIdsByName = await this.artistRepository
            .createQueryBuilder("a")
            .select("a.id", "id")
            .where("a.name LIKE :query", { query: `%${query}%` })
            .getRawMany<{ id: string }>()
            .then(results => results.map(result => result.id))
            .then(ids => ids.map(id => parseInt(`${id}`, 10)));

        const artistIds = _.uniq([...artistIdsByAlbum, ...artistIdsByMusic, ...artistIdsByName]);
        return this.findByIds(artistIds);
    }

    public async getSuggestions(query: string): Promise<SearchSuggestion[]> {
        return this.artistRepository
            .createQueryBuilder("a")
            .select("a.name", "name")
            .addSelect("a.id", "id")
            .where("a.name LIKE :query", { query: `%${query}%` })
            .getRawMany<{ name: string; id: number }>()
            .then(results =>
                results.map(item => ({
                    id: item.id,
                    name: item.name,
                    type: SearchSuggestionType.Artist,
                })),
            );
    }
}
