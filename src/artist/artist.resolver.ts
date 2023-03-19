import { Inject } from "@nestjs/common";
import { Args, Context, Int, Query, ResolveField, Resolver, Root } from "@nestjs/graphql";

import { ArtistService } from "@main/artist/artist.service";

import { Artist } from "@main/artist/models/artist.model";
import { Music } from "@main/music/models/music.model";
import { Album } from "@main/album/models/album.model";

import { GraphQLContext } from "@main/context";

@Resolver(() => Artist)
export class ArtistResolver {
    public constructor(@Inject(ArtistService) private readonly artistService: ArtistService) {}

    @Query(() => Artist, { nullable: true })
    public async artist(@Args("id", { type: () => Int }) id: number): Promise<Artist> {
        return this.artistService.findById(id);
    }

    @Query(() => [Artist])
    public async artists(): Promise<Artist[]> {
        return this.artistService.findAll();
    }

    @ResolveField(() => Int)
    public async musicCount(@Root() artist: Artist): Promise<number> {
        return artist.musicIds.length;
    }

    @ResolveField(() => [Music])
    public async musics(@Root() artist: Artist, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        return loaders.music.loadMany(artist.musicIds);
    }

    @ResolveField(() => [Album])
    public async albums(@Root() artist: Artist, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        return loaders.album.loadMany(artist.albumIds);
    }

    @ResolveField(() => [Album])
    public async leadAlbums(@Root() artist: Artist, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        return loaders.album.loadMany(artist.leadAlbumIds);
    }
}
