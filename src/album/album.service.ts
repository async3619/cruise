import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Album } from "@main/album/models/album.model";
import { Artist } from "@main/artist/models/artist.model";

import { BaseService } from "@main/common/base.service";

@Injectable()
export class AlbumService extends BaseService<Album> {
    public constructor(@InjectRepository(Album) private readonly albumRepository: Repository<Album>) {
        super(albumRepository, Album);
    }

    public async create(title: string, artists: Artist[], leadArtists: Artist[]) {
        const album = this.albumRepository.create();
        album.title = title;
        album.artists = artists;
        album.leadArtists = leadArtists;

        return this.albumRepository.save(album);
    }
}
