import { Repository } from "typeorm";
import { Service } from "typedi";

import { Music } from "@main/music/models/music.model";

import { InjectRepository } from "@main/utils/models";
import BaseService from "@main/utils/base.service";

@Service()
export default class MusicService extends BaseService<Music> {
    public constructor(@InjectRepository(Music) private readonly musicRepository: Repository<Music>) {
        super(musicRepository, "Music");
    }

    public async getMusics(): Promise<Music[]> {
        return this.musicRepository.find();
    }
}
