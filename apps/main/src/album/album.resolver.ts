import _ from "lodash";
import { Nullable } from "types";

import { Inject } from "@nestjs/common";
import { Args, Context, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { AlbumService } from "@album/album.service";

import { Album } from "@album/models/album.model";
import { Artist } from "@artist/models/artist.model";
import { AlbumArt } from "@album-art/models/album-art.model";
import { Music } from "@music/models/music.model";

import { GraphQLContext } from "@root/context";

@Resolver(() => Album)
export class AlbumResolver {
    public constructor(@Inject(AlbumService) private readonly albumService: AlbumService) {}

    @Query(() => Album, { nullable: true })
    public async album(@Args("id", { type: () => Int }) id: number): Promise<Nullable<Album>> {
        return this.albumService.findById(id);
    }

    @Query(() => [Album])
    public async albums(): Promise<Album[]> {
        return this.albumService.findAll();
    }

    @ResolveField(() => [Music])
    public async musics(
        @Parent() album: Album,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ): Promise<Music[]> {
        let musics = await Promise.all(album.musicIds.map(id => loaders.music.load(id)));
        musics = _.orderBy(musics, ["trackNumber"], ["asc"]);

        return musics;
    }

    @ResolveField(() => [Artist])
    public async artists(
        @Parent() album: Album,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ): Promise<Artist[]> {
        return Promise.all(album.artistIds.map(id => loaders.artist.load(id)));
    }

    @ResolveField(() => AlbumArt, { nullable: true })
    public async albumArt(
        @Parent() album: Album,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ): Promise<AlbumArt | null> {
        return loaders.primaryAlbumArt.load(album.albumArtIds);
    }

    @ResolveField(() => [AlbumArt])
    public async albumArts(
        @Parent() album: Album,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ): Promise<AlbumArt[]> {
        return Promise.all(album.albumArtIds.map(id => loaders.albumArt.load(id)));
    }
}
