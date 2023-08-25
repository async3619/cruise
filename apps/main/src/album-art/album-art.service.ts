import * as mm from "music-metadata";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { BaseService } from "@base/base.service";

import { AlbumArt } from "@album-art/models/album-art.model";
import { Image } from "@image/models/image.model";

export type AlbumArtCreationArgs = [image: Image, picture: mm.IPicture];

@Injectable()
export class AlbumArtService extends BaseService<AlbumArt, AlbumArtCreationArgs> {
    public constructor(@InjectRepository(AlbumArt) private readonly albumArtRepository: Repository<AlbumArt>) {
        super(albumArtRepository);
    }

    public create(image: Image, picture: mm.IPicture) {
        return this.albumArtRepository.create({
            image,
            type: picture.type,
            description: picture.description,
        });
    }
}
