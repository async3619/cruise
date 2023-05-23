import { forwardRef, Inject } from "@nestjs/common";
import { Args, Context, Int, Query, ResolveField, Resolver, Root, Subscription } from "@nestjs/graphql";

import { MusicService } from "@main/music/music.service";
import { MUSICS_UPDATED, MUSIC_ADDED, MUSIC_REMOVED, MUSIC_UPDATED, MUSICS_ADDED } from "@main/music/music.constants";

import { AlbumService } from "@main/album/album.service";

import { Music } from "@main/music/models/music.model";
import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";

import { GraphQLContext } from "@main/context";
import pubSub from "@main/pubsub";

import type { Nullable } from "@common/types";

@Resolver(() => Music)
export class MusicResolver {
    public constructor(
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(forwardRef(() => AlbumService)) private readonly albumService: AlbumService,
    ) {}

    @Query(() => Music, { nullable: true })
    public async music(@Args("id", { type: () => Int }) id: number): Promise<Music> {
        return this.musicService.findById(id);
    }

    @Query(() => [Music])
    public async musics(): Promise<Music[]> {
        return this.musicService.findAll();
    }

    @Subscription(() => Music)
    public async musicAdded() {
        return pubSub.asyncIterator(MUSIC_ADDED);
    }

    @Subscription(() => Music)
    public async musicUpdated() {
        return pubSub.asyncIterator(MUSIC_UPDATED);
    }

    @Subscription(() => [Music])
    public async musicsAdded() {
        return pubSub.asyncIterator(MUSICS_ADDED);
    }

    @Subscription(() => [Music])
    public async musicsUpdated() {
        return pubSub.asyncIterator(MUSICS_UPDATED);
    }

    @Subscription(() => Int)
    public async musicRemoved() {
        return pubSub.asyncIterator(MUSIC_REMOVED);
    }

    @ResolveField(() => String, { nullable: true })
    public async genre(@Root() music: Music): Promise<Nullable<string>> {
        return music.genre?.replace(/\0/g, "/");
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

        return await loaders.album.load(music.albumId);
    }

    @ResolveField(() => [AlbumArt])
    public async albumArts(@Root() music: Music, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        return loaders.albumArt.loadMany(music.albumArtIds);
    }
}
