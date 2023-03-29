import { Inject } from "@nestjs/common";
import { Args, Context, Int, Query, ResolveField, Resolver, Root, Subscription } from "@nestjs/graphql";

import { ArtistService } from "@main/artist/artist.service";
import { LEAD_ARTIST_ADDED, LEAD_ARTIST_REMOVED } from "@main/artist/artist.constants";

import { Artist } from "@main/artist/models/artist.model";
import { Music } from "@main/music/models/music.model";
import { Album } from "@main/album/models/album.model";

import { GraphQLContext } from "@main/context";
import pubSub from "@main/pubsub";

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

    @Query(() => [Artist])
    public async leadArtists(): Promise<Artist[]> {
        return this.artistService.findLeadArtists();
    }

    @Subscription(() => Artist)
    public async leadArtistAdded(): Promise<AsyncIterator<Artist>> {
        return pubSub.asyncIterator(LEAD_ARTIST_ADDED);
    }

    @Subscription(() => Int)
    public async leadArtistRemoved() {
        return pubSub.asyncIterator(LEAD_ARTIST_REMOVED);
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
