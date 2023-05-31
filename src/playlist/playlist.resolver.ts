import { Inject } from "@nestjs/common";
import { Args, Int, Mutation, Query, ResolveField, Resolver, Root, Subscription } from "@nestjs/graphql";

import { Music } from "@main/music/models/music.model";

import { PlaylistService } from "@main/playlist/playlist.service";
import { Playlist } from "@main/playlist/models/playlist.model";
import { CreatePlaylistInput, UpdatePlaylistInput } from "@main/playlist/models/playlist.dto";

@Resolver(() => Playlist)
export class PlaylistResolver {
    public constructor(@Inject(PlaylistService) private readonly playlistService: PlaylistService) {}

    @Query(() => [Playlist])
    public async playlists(): Promise<Playlist[]> {
        return this.playlistService.findAll();
    }

    @Query(() => Playlist)
    public async playlist(@Args("id", { type: () => Int }) id: number): Promise<Playlist> {
        return this.playlistService.findById(id);
    }

    @Mutation(() => Playlist)
    public async createPlaylist(
        @Args("input", { type: () => CreatePlaylistInput }) input: CreatePlaylistInput,
    ): Promise<Playlist> {
        return this.playlistService.create(input);
    }

    @Mutation(() => Playlist)
    public async createPlaylistFromMusics(
        @Args("input", { type: () => CreatePlaylistInput }) input: CreatePlaylistInput,
        @Args("musicIds", { type: () => [Int] }) musicIds: number[],
    ): Promise<Playlist> {
        return this.playlistService.createFromMusics(input, musicIds);
    }

    @Mutation(() => Playlist)
    public async addMusicsToPlaylist(
        @Args("musicIds", { type: () => [Int] }) musicIds: number[],
        @Args("playlistId", { type: () => Int }) playlistId: number,
    ): Promise<Playlist> {
        return this.playlistService.addMusics(playlistId, musicIds);
    }

    @Mutation(() => Playlist)
    public async updatePlaylist(
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdatePlaylistInput }) input: UpdatePlaylistInput,
    ): Promise<Playlist> {
        return this.playlistService.update(id, input);
    }

    @Mutation(() => Boolean)
    public async deletePlaylist(@Args("id", { type: () => Int }) id: number): Promise<boolean> {
        return this.playlistService.remove(id);
    }

    @Mutation(() => Playlist)
    public async deleteMusicsFromPlaylist(
        @Args("playlistId", { type: () => Int }) playlistId: number,
        @Args("indices", { type: () => [Int] }) indices: number[],
    ) {
        return this.playlistService.deleteMusicsFromPlaylist(playlistId, indices);
    }

    @Subscription(() => Playlist)
    public playlistAdded(): AsyncIterator<Playlist> {
        return this.playlistService.subscribe("playlistAdded");
    }

    @Subscription(() => Playlist)
    public playlistUpdated(): AsyncIterator<Playlist> {
        return this.playlistService.subscribe("playlistUpdated");
    }

    @Subscription(() => Int)
    public playlistRemoved(): AsyncIterator<number> {
        return this.playlistService.subscribe("playlistRemoved");
    }

    @ResolveField(() => [Music])
    public async musics(@Root() playlist: Playlist): Promise<Music[]> {
        return this.playlistService.getMusics(playlist);
    }
}
