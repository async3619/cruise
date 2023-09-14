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

    @Mutation(() => Boolean)
    public async clearPlaylist(@Args("playlistId", { type: () => Int }) playlistId: number): Promise<boolean> {
        await this.playlistService.clear(playlistId);
        return true;
    }

    @Mutation(() => Boolean)
    public async deletePlaylist(@Args("id", { type: () => Int }) id: number): Promise<boolean> {
        await this.playlistService.delete(id);
        return true;
    }

    @Mutation(() => Boolean)
    public async deletePlaylistItems(
        @Args("playlistId", { type: () => Int }) playlistId: number,
        @Args("indices", { type: () => [Int] }) indices: number[],
    ): Promise<boolean> {
        await this.playlistService.deleteItems(playlistId, indices);
        return true;
    }

    @Mutation(() => Boolean)
    public async renamePlaylist(
        @Args("id", { type: () => Int }) id: number,
        @Args("name", { type: () => String }) name: string,
    ): Promise<boolean> {
        await this.playlistService.rename(id, name);
        return true;
    }

    @Mutation(() => Boolean)
    public async addMusicsToPlaylist(
        @Args("playlistId", { type: () => Int }) playlistId: number,
        @Args("musicIds", { type: () => [Int] }) musicIds: number[],
    ): Promise<boolean> {
        await this.playlistService.addMusicsToPlaylist(playlistId, musicIds);
        return true;
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

    @Subscription(() => Int, { resolve: payload => payload[PlaylistEvents.DELETED] })
    public playlistDeleted() {
        return this.playlistService.asyncIterator(PlaylistEvents.DELETED);
    }

    @Subscription(() => Playlist, { resolve: payload => payload[PlaylistEvents.UPDATED] })
    public playlistUpdated() {
        return this.playlistService.asyncIterator(PlaylistEvents.UPDATED);
    }
}
