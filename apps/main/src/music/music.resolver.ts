import { Inject } from "@nestjs/common";
import { Context, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { MusicService } from "@music/music.service";

import { Music } from "@music/models/music.model";
import { Album } from "@album/models/album.model";

import { GraphQLContext } from "@root/context";
import { Artist } from "@artist/models/artist.model";
import { AlbumArt } from "@album-art/models/album-art.model";

@Resolver(() => Music)
export class MusicResolver {
    public constructor(@Inject(MusicService) private readonly musicService: MusicService) {}

    @Query(() => [Music])
    public async musics(): Promise<Music[]> {
        return this.musicService.findAll();
    }

    @ResolveField(() => Album, { nullable: true })
    public async album(
        @Parent() music: Music,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ): Promise<Album | null> {
        if (!music.albumId) {
            return null;
        }

        return loaders.album.load(music.albumId);
    }

    @ResolveField(() => [Artist])
    public async artists(
        @Parent() music: Music,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ): Promise<Artist[]> {
        return Promise.all(music.artistIds.map(id => loaders.artist.load(id)));
    }

    @ResolveField(() => [AlbumArt])
    public async albumArts(
        @Parent() music: Music,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ): Promise<AlbumArt[]> {
        return Promise.all(music.albumArtIds.map(id => loaders.albumArt.load(id)));
    }
}
