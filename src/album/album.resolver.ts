import * as _ from "lodash";

import { Inject } from "@nestjs/common";
import { Args, Context, Int, Mutation, Query, ResolveField, Resolver, Root } from "@nestjs/graphql";

import { GraphQLContext } from "@main/context";

import { AlbumService } from "@main/album/album.service";
import { MusicService } from "@main/music/music.service";

import { Music } from "@main/music/models/music.model";
import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { UpdateAlbumInput } from "@main/album/models/update-album.input";

import loadMany from "@main/utils/loadMany";
import common from "@main/utils/common";

import { Nullable } from "@common/types";

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
    public async albums(): Promise<Album[]> {
        return this.albumService.findAll();
    }

    @Mutation(() => Album)
    public async updateAlbum(
        @Args("id", { type: () => Int }) id: number,
        @Args("data", { type: () => UpdateAlbumInput }) data: UpdateAlbumInput,
    ): Promise<Album> {
        return this.albumService.update(id, data);
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

        return common(genres);
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
        return loaders.artist.loadMany(album.leadArtistIds);
    }
}