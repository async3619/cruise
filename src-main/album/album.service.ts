import { Repository } from "typeorm";
import { Service } from "typedi";

import BaseService from "@main/utils/base.service";

import { Album } from "@main/album/models/album.model";

import { InjectRepository } from "@main/utils/models";

@Service()
export default class AlbumService extends BaseService<Album> {
    public constructor(@InjectRepository(Album) private readonly albumRepository: Repository<Album>) {
        super(albumRepository, "Album");
    }
}
