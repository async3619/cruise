import * as _ from "lodash";

import { Inject } from "@nestjs/common";
import { Args, Context, Int, Mutation, Query, ResolveField, Resolver, Root, Subscription } from "@nestjs/graphql";

import { GraphQLContext } from "@main/context";

import { AlbumService } from "@main/album/album.service";
import { UpdateAlbumInput } from "@main/album/models/update-album.input";

import { MusicService } from "@main/music/music.service";
import { Music } from "@main/music/models/music.model";

import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";

import loadMany from "@main/utils/loadMany";
import common from "@main/utils/common";

import type { Nullable } from "@common/types";

@Resolver(() => Album)
export class AlbumResolver {
    public constructor(
        @Inject(AlbumService) private readonly albumService: AlbumService,
        @Inject(MusicService) private readonly musicService: MusicService,
    ) {}

    @Query(() => Album, { nullable: true })
    public async album(@Args("id", { type: () => Int }) id: number): Promise<Nullable<Album>> {
        return this.albumService.findById(id);
    }

    @Query(() => [Album])
    public async leadAlbumsByArtist(@Args("id", { type: () => Int }) id: number): Promise<Album[]> {
        return this.albumService.findLeadAlbumsByArtist(id);
    }

    @Query(() => [Album])
    public async albums(): Promise<Album[]> {
        return this.albumService.findAll();
    }

    @Mutation(() => Album)
    public async updateAlbum(
        @Args("id", { type: () => Int }) id: number,
        @Args("data", { type: () => UpdateAlbumInput }) data: UpdateAlbumInput,
    ): Promise<Album> {
        return this.albumService.updateAlbum(id, data);
    }

    @Subscription(() => Album)
    public async albumAdded() {
        return this.albumService.subscribe("albumAdded");
    }

    @Subscription(() => Int)
    public async albumRemoved() {
        return this.albumService.subscribe("albumDeleted");
    }

    @Subscription(() => [Album])
    public async albumsUpdated() {
        return this.albumService.subscribe("albumsUpdated");
    }

    @Subscription(() => Album, {
        filter: (payload, variables) => payload.albumUpdated.id === variables.id,
    })
    public async albumUpdated(@Args("id", { type: () => Int }) _: number) {
        return this.albumService.subscribe("albumUpdated");
    }

    @ResolveField(() => Int, { nullable: true })
    public async year(
        @Root() album: Album,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ): Promise<Nullable<number>> {
        const musics = await loadMany(loaders.music, album.musicIds);
        const years = musics.map(music => music.year).filter((year): year is number => !!year);

        if (years.length === 0) {
            return null;
        }

        return Math.max(...years);
    }

    @ResolveField(() => String, { nullable: true })
    public async genre(
        @Root() album: Album,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ): Promise<Nullable<string>> {
        const musics = await loadMany(loaders.music, album.musicIds);
        const genres = musics.map(music => music.genre).filter((genre): genre is string => !!genre);

        return common(genres)?.replace(/\0/g, "/");
    }

    @ResolveField(() => [AlbumArt])
    public async albumArts(@Root() album: Album, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        return loaders.albumArt.loadMany(album.albumArtIds);
    }

    @ResolveField(() => Int)
    public async musicCount(@Root() album: Album): Promise<number> {
        return album.musicIds.length;
    }

    @ResolveField(() => [Music])
    public async musics(@Root() album: Album, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        const musics = await loadMany(loaders.music, album.musicIds);
        return _.orderBy(musics, m => m.track || Infinity, "asc");
    }

    @ResolveField(() => [Artist])
    public async artists(@Root() album: Album, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        return loaders.artist.loadMany(album.artistIds);
    }

    @ResolveField(() => [Artist])
    public async leadArtists(@Root() album: Album, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        return await loaders.artist.loadMany(album.leadArtistIds);
    }
}
