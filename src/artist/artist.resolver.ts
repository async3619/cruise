import { Inject } from "@nestjs/common";
import { Args, Context, Int, Query, ResolveField, Resolver, Root, Subscription } from "@nestjs/graphql";

import { ArtistService } from "@main/artist/artist.service";

import { Artist } from "@main/artist/models/artist.model";
import { Music } from "@main/music/models/music.model";
import { Album } from "@main/album/models/album.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";

import { GraphQLContext } from "@main/context";
import type { Nullable } from "@common/types";

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
        return this.artistService.subscribe("leadArtistAdded");
    }

    @Subscription(() => Int)
    public async leadArtistRemoved() {
        return this.artistService.subscribe("leadArtistRemoved");
    }

    @Subscription(() => Artist, {
        filter: (payload, variables) => payload.artistPortraitAdded.id === variables.artistId,
    })
    public async artistPortraitAdded(@Args("artistId", { type: () => Int }) _: number) {
        return this.artistService.subscribe("artistPortraitAdded");
    }

    @ResolveField(() => AlbumArt, { nullable: true })
    public async portrait(
        @Root() artist: Artist,
        @Args("fetch", { type: () => Boolean, nullable: true }) fetch: Nullable<boolean>,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ) {
        const portrait = artist.portraitId ? await loaders.albumArt.load(artist.portraitId) : null;
        if (fetch) {
            if (!portrait) {
                this.artistService.fetchPortrait(artist).then();
            }
        }

        return portrait;
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
