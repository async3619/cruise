import { Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import MusicService from "@main/library/music/music.service";

import { Music } from "@main/library/music/models/music.model";

@Service()
@Resolver(() => Music)
export default class MusicResolver {
    public constructor(private readonly musicService: MusicService) {}

    @Query(() => [Music])
    public async musics(): Promise<Music[]> {
        return this.musicService.getMusics();
    }
}
