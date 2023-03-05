import { Repository } from "typeorm";
import { Service } from "typedi";

import { InjectRepository } from "@main/utils/models";

import { Music } from "@main/library/music/models/music.model";

@Service()
export default class MusicService {
    public constructor(@InjectRepository(Music) private readonly musicRepository: Repository<Music>) {}

    public async getMusics(): Promise<Music[]> {
        return this.musicRepository.find();
    }
}
