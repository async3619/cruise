import { Inject } from "@nestjs/common";
import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { PlaylistService } from "@playlist/playlist.service";
import { Playlist } from "@playlist/models/playlist.model";
import { Music } from "@music/models/music.model";

import { GraphQLContext } from "@root/context";

@Resolver(() => Playlist)
export class PlaylistResolver {
    public constructor(@Inject(PlaylistService) private readonly playlistService: PlaylistService) {}

    @Query(() => [Playlist])
    public async playlists(): Promise<Playlist[]> {
        return this.playlistService.findAll();
    }

    @Mutation(() => Playlist)
    public async createPlaylist(
        @Args("name", { type: () => String }) name: string,
        @Args("musicIds", { type: () => [Int] }) musicIds: number[],
    ): Promise<Playlist> {
        return this.playlistService.createFromMusicIds(name, musicIds);
    }

    @ResolveField(() => [Music])
    public async musics(
        @Parent() playlist: Playlist,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ): Promise<Music[]> {
        return Promise.all(playlist.musicIds.map(id => loaders.music.load(id)));
    }
}
