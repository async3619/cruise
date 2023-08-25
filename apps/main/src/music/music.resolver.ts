import { Inject } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { MusicService } from "@music/music.service";

import { Music } from "@music/models/music.model";

@Resolver()
export class MusicResolver {
    public constructor(@Inject(MusicService) private readonly musicService: MusicService) {}

    @Query(() => [Music])
    public async musics(): Promise<Music[]> {
        return this.musicService.findAll();
    }
}
