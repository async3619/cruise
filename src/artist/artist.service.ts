import { Repository } from "typeorm";
import { Service } from "typedi";

import { Artist } from "@main/artist/models/artist.model";

import { InjectRepository } from "@main/utils/models";
import BaseService from "@main/utils/base.service";

@Service()
export default class ArtistService extends BaseService<Artist> {
    public constructor(@InjectRepository(Artist) private readonly artistRepository: Repository<Artist>) {
        super(artistRepository, "Artist");
    }
}
