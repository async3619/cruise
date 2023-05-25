import { Inject } from "@nestjs/common";
import { Args, Int, Mutation, Query, ResolveField, Resolver, Root, Subscription } from "@nestjs/graphql";

import { Music } from "@main/music/models/music.model";

import { PlaylistService } from "@main/playlist/playlist.service";
import { Playlist } from "@main/playlist/models/playlist.model";
import { CreatePlaylistInput } from "@main/playlist/models/playlist.dto";
import { PLAYLIST_ADDED } from "@main/playlist/playlist.constants";

import pubsub from "@main/pubsub";

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

    @Subscription(() => Playlist)
    public playlistAdded(): AsyncIterator<Playlist> {
        return pubsub.asyncIterator(PLAYLIST_ADDED);
    }

    @ResolveField(() => [Music])
    public async musics(@Root() playlist: Playlist): Promise<Music[]> {
        return this.playlistService.getMusics(playlist);
    }
}
