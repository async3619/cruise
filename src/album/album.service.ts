import { Repository } from "typeorm";
import _ from "lodash";

import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Album } from "@main/album/models/album.model";
import { UpdateAlbumInput } from "@main/album/models/update-album.input";

import { BaseService } from "@main/common/base.service";
import { MusicService } from "@main/music/music.service";
import { ArtistService } from "@main/artist/artist.service";
import { AlbumArtService } from "@main/album-art/album-art.service";
import { LibraryService } from "@main/library/library.service";
import { SearchSuggestion, SearchSuggestionType } from "@main/library/models/search-suggestion.dto";

import { Searchable } from "@main/common/searchable.interface";

import { EnsureResult } from "@main/utils/types";

export interface AlbumServicePubSub {
    albumsAdded: Album[];
    albumUpdated: Album;
    albumsUpdated: Album[];
    albumsRemoved: number[];
}

@Injectable()
export class AlbumService extends BaseService<Album, AlbumServicePubSub> implements Searchable<Album> {
    public constructor(
        @InjectRepository(Album) private readonly albumRepository: Repository<Album>,
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(ArtistService) private readonly artistService: ArtistService,
        @Inject(AlbumArtService) private readonly albumArtService: AlbumArtService,
        @Inject(forwardRef(() => LibraryService)) private readonly libraryService: LibraryService,
    ) {
        super(albumRepository, Album);
    }

    public async findLeadAlbumsByArtist(artistId: number) {
        const allAlbums = await this.findAll();

        return allAlbums.filter(album => album.leadArtistIds.includes(artistId));
    }

    public async ensure(albumName: string): Promise<EnsureResult<Album>> {
        let created = false;
        let album = await this.albumRepository.findOne({
            where: {
                title: albumName,
            },
            relations: {
                albumArts: true,
                leadArtists: true,
                artists: true,
            },
        });

        if (!album) {
            album = this.albumRepository.create({
                title: albumName,
            });

            album = await this.albumRepository.save(album);
            created = true;
        }

        return {
            item: album,
            created,
        };
    }

    public async updateAlbum(id: number, _: UpdateAlbumInput) {
        const album = await this.findById(id, ["artists", "leadArtists", "musics"]);
        if (!album) {
            throw new Error(`Album with id '${id}' not found`);
        }

        // TODO: Update album art

        return album;
    }

    public async search(query: string): Promise<Album[]> {
        const albumIdsByArtists = await this.albumRepository
            .createQueryBuilder("a")
            .select("a.id", "id")
            .leftJoin("albums_artists_artists", "aaa", "a.id = aaa.albumsId")
            .leftJoin("artists", "aa", "aaa.artistsId = aa.id")
            .where("a.title LIKE :query", { query: `%${query}%` })
            .orWhere("aa.name LIKE :query", { query: `%${query}%` })
            .getRawMany<{ id: number | string }>()
            .then(results => results.map(result => result.id))
            .then(ids => ids.map(id => parseInt(`${id}`, 10)));

        const albumIdsByLeadArtists = await this.albumRepository
            .createQueryBuilder("a")
            .select("a.id", "id")
            .leftJoin("albums_lead_artists_artists", "alaa", "a.id = alaa.albumsId")
            .leftJoin("artists", "ala", "alaa.artistsId = ala.id")
            .where("a.title LIKE :query", { query: `%${query}%` })
            .orWhere("ala.name LIKE :query", { query: `%${query}%` })
            .getRawMany<{ id: number | string }>()
            .then(results => results.map(result => result.id))
            .then(ids => ids.map(id => parseInt(`${id}`, 10)));

        const albumIdsByMusics = await this.albumRepository
            .createQueryBuilder("a")
            .select("a.id", "id")
            .leftJoin("musics", "m", "a.id = m.albumId")
            .where("m.title LIKE :query", { query: `%${query}%` })
            .getRawMany<{ id: number | string }>()
            .then(results => results.map(result => result.id))
            .then(ids => ids.map(id => parseInt(`${id}`, 10)));

        const targetIds = [...albumIdsByArtists, ...albumIdsByLeadArtists, ...albumIdsByMusics];

        return this.findByIds(_.uniq(targetIds));
    }

    public async getSuggestions(query: string): Promise<SearchSuggestion[]> {
        return this.albumRepository
            .createQueryBuilder("a")
            .select("a.title", "title")
            .addSelect("a.id", "id")
            .where("a.title LIKE :query", { query: `%${query}%` })
            .getRawMany<{ title: string; id: number }>()
            .then(results =>
                results.map(item => ({
                    type: SearchSuggestionType.Album,
                    name: item.title,
                    id: item.id,
                })),
            );
    }
}
