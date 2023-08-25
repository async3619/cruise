import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { BaseService } from "@base/base.service";

import { Album } from "@album/models/album.model";

type AlbumCreationArgs = [title: string];

@Injectable()
export class AlbumService extends BaseService<Album, AlbumCreationArgs> {
    public constructor(@InjectRepository(Album) private readonly albumRepository: Repository<Album>) {
        super(albumRepository);
    }

    public create(title: string) {
        const album = this.albumRepository.create();
        album.title = title;
        album.artistNames = [];
        album.albumArtists = [];

        return album;
    }
}
