import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { BaseService } from "@base/base.service";

import { Artist } from "@artist/models/artist.model";

export type ArtistCreationArgs = [name: string];

@Injectable()
export class ArtistService extends BaseService<Artist, ArtistCreationArgs> {
    public constructor(@InjectRepository(Artist) private readonly artistRepository: Repository<Artist>) {
        super(artistRepository);
    }

    public create(name: string): Artist {
        return this.artistRepository.create({ name });
    }
}
