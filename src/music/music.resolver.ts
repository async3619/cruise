import { Inject } from "@nestjs/common";
import { Args, Context, Int, Query, ResolveField, Resolver, Root } from "@nestjs/graphql";

import { MusicService } from "@main/music/music.service";

import { Music } from "@main/music/models/music.model";
import { Artist } from "@main/artist/models/artist.model";

import { GraphQLContext } from "@main/context";
import { Album } from "@main/album/models/album.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";

@Resolver(() => Music)
export class MusicResolver {
    public constructor(@Inject(MusicService) private readonly musicService: MusicService) {}

    @Query(() => Music, { nullable: true })
    public async music(@Args("id", { type: () => Int }) id: number): Promise<Music> {
        return this.musicService.findById(id);
    }

    @Query(() => [Music])
    public async musics(): Promise<Music[]> {
        return this.musicService.findAll();
    }

    @ResolveField(() => [Artist])
    public async artists(@Root() music: Music, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        return loaders.artist.loadMany(music.artistIds);
    }

    @ResolveField(() => Album, { nullable: true })
    public async album(@Root() music: Music, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        if (!music.albumId) {
            return null;
        }

        return loaders.album.load(music.albumId);
    }

    @ResolveField(() => [AlbumArt])
    public async albumArts(@Root() music: Music, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        return loaders.albumArt.loadMany(music.albumArtIds);
    }
}
