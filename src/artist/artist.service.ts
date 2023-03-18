import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Artist } from "@main/artist/models/artist.model";

import { BaseService } from "@main/common/base.service";

@Injectable()
export class ArtistService extends BaseService<Artist> {
    public constructor(@InjectRepository(Artist) private readonly artistRepository: Repository<Artist>) {
        super(artistRepository, Artist);
    }

    public async create(name: string) {
        const artist = this.artistRepository.create();
        artist.name = name;

        return this.artistRepository.save(artist);
    }
}
