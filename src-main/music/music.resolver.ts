import { Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Service } from "typedi";

import MusicService from "@main/music/music.service";

import { Music } from "@main/music/models/music.model";
import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";

import type { GraphQLContext } from "@main/graphql/types";

@Service()
@Resolver(() => Music)
export default class MusicResolver {
    public constructor(private readonly musicService: MusicService) {}

    @Query(() => [Music])
    public async musics(): Promise<Music[]> {
        return this.musicService.getMusics();
    }

    @FieldResolver(() => [Artist])
    public async artists(@Root() music: Music, @Ctx() context: GraphQLContext) {
        return context.artistLoader.loadMany(music.artistIds);
    }

    @FieldResolver(() => Album, { nullable: true })
    public async album(@Root() music: Music, @Ctx() context: GraphQLContext) {
        if (!music.albumId) {
            return null;
        }

        return context.albumLoader.load(music.albumId);
    }
}
