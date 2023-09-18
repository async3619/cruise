import { Nullable } from "types";

import { Inject } from "@nestjs/common";
import { Resolver, Query, Int, Args, ResolveField, Parent, Context } from "@nestjs/graphql";

import { ArtistService } from "@artist/artist.service";

import { Artist } from "@artist/models/artist.model";
import { Music } from "@music/models/music.model";
import { Album } from "@album/models/album.model";

import { GraphQLContext } from "@root/context";

@Resolver(() => Artist)
export class ArtistResolver {
    public constructor(@Inject(ArtistService) private readonly artistService: ArtistService) {}

    @Query(() => Artist, { nullable: true })
    public async artist(@Args("id", { type: () => Int }) id: number): Promise<Nullable<Artist>> {
        return this.artistService.findById(id);
    }

    @Query(() => [Artist])
    public async artists(): Promise<Artist[]> {
        return this.artistService.findAll();
    }

    @ResolveField(() => [Music])
    public async musics(@Parent() artist: Artist, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        return Promise.all(artist.musicIds.map(id => loaders.music.load(id)));
    }

    @ResolveField(() => [Album])
    public async albums(@Parent() artist: Artist, @Context("loaders") loaders: GraphQLContext["loaders"]) {
        return Promise.all(artist.albumIds.map(id => loaders.album.load(id)));
    }
}
