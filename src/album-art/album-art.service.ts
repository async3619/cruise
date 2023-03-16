import { Repository } from "typeorm";
import { Service } from "typedi";

import { AlbumArt } from "@main/album-art/models/album-art.model";

import { InjectRepository } from "@main/utils/models";

import BaseService from "@main/utils/base.service";

@Service()
export default class AlbumArtService extends BaseService<AlbumArt> {
    public constructor(@InjectRepository(AlbumArt) private readonly albumArtRepository: Repository<AlbumArt>) {
        super(albumArtRepository, "AlbumArt");
    }
}
