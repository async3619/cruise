import _ from "lodash";
import { FindOptionsRelations, Like, Repository } from "typeorm";
import * as path from "path";

import { Audio } from "@async3619/merry-go-round";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Music } from "@main/music/models/music.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";
import { Album } from "@main/album/models/album.model";
import { Artist } from "@main/artist/models/artist.model";
import { SearchSuggestion, SearchSuggestionType } from "@main/library/models/search-suggestion.dto";

import { BaseService } from "@main/common/base.service";
import { Searchable } from "@main/common/searchable.interface";

import type { Nullable } from "@common/types";

interface MusicPubSub {
    musicAdded: Music;
    musicUpdated: Music;
    musicRemoved: number;
    musicsAdded: Music[];
    musicsUpdated: Music[];
    musicsRemoved: number[];
}

@Injectable()
export class MusicService extends BaseService<Music, MusicPubSub> implements Searchable<Music> {
    public constructor(@InjectRepository(Music) private readonly musicRepository: Repository<Music>) {
        super(musicRepository, Music);
    }

    public async create(
        audio: Audio,
        filePath: string,
        albumArts: AlbumArt[],
        album: Nullable<Album>,
        featuredArtists: Artist[],
        leadArtists: Artist[],
    ) {
        const fileName = path.basename(filePath);
        const music = this.musicRepository.create();
        music.title = audio.title || fileName;
        music.genre = audio.genre;
        music.year = audio.year;
        music.track = audio.track;
        music.disc = audio.disc;
        music.duration = audio.duration;
        music.albumArtists = leadArtists;
        music.path = filePath;
        music.albumArts = albumArts;
        music.album = album;
        music.artists = featuredArtists;

        return this.musicRepository.save(music);
    }

    public async findByPath(
        filePath: string,
        relations?: FindOptionsRelations<Music> | Array<Exclude<keyof Music, number | symbol>>,
    ) {
        return this.musicRepository.findOne({
            where: { path: filePath },
            relations,
        });
    }

    public async findByDirectory(
        directoryPath: string,
        relations?: FindOptionsRelations<Music> | Array<Exclude<keyof Music, number | symbol>>,
    ) {
        return this.musicRepository.find({
            where: { path: Like(`${directoryPath}${path.sep}%`) },
            relations,
        });
    }

    public async search(query: string): Promise<Music[]> {
        const artistMusicIds = await this.musicRepository
            .createQueryBuilder("m")
            .select("m.id", "id")
            .leftJoin("musics_artists_artists", "maa", "m.id = maa.musicsId")
            .leftJoin("artists", "a", "maa.artistsId = a.id")
            .leftJoin("albums", "al", "m.albumId = al.id")
            .where("a.name like :query", { query: `%${query}%` })
            .orWhere("m.title like :query", { query: `%${query}%` })
            .orWhere("al.title like :query", { query: `%${query}%` })
            .getRawMany<{ id: number | string }>()
            .then(result => result.map(r => r.id))
            .then(ids => ids.map(id => parseInt(`${id}`, 10)));

        return this.findByIds(_.uniq(artistMusicIds));
    }

    public async getSuggestions(query: string): Promise<SearchSuggestion[]> {
        return this.musicRepository
            .createQueryBuilder("m")
            .select("m.title", "title")
            .addSelect("m.id", "id")
            .where("m.title like :query", { query: `%${query}%` })
            .getRawMany<{ title: string; id: number }>()
            .then(result =>
                result.map(r => ({
                    type: SearchSuggestionType.Music,
                    id: r.id,
                    name: r.title,
                })),
            );
    }
}
