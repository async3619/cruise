import { Inject } from "@nestjs/common";
import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from "@nestjs/graphql";

import { PlaylistEvents, PlaylistService } from "@playlist/playlist.service";
import { Playlist } from "@playlist/models/playlist.model";
import { Music } from "@music/models/music.model";

import { GraphQLContext } from "@root/context";

@Resolver(() => Playlist)
export class PlaylistResolver {
    public constructor(@Inject(PlaylistService) private readonly playlistService: PlaylistService) {}

    @Query(() => Playlist, { nullable: true })
    public async playlist(@Args("id", { type: () => Int }) id: number) {
        return this.playlistService.findById(id);
    }

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

    @Subscription(() => Playlist, { resolve: payload => payload[PlaylistEvents.CREATED] })
    public playlistCreated() {
        return this.playlistService.asyncIterator(PlaylistEvents.CREATED);
    }
}