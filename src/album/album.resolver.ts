import * as _ from "lodash";
import { Ctx, FieldResolver, Arg, Query, Resolver, Root, Int } from "type-graphql";
import { Service } from "typedi";

import AlbumService from "@main/album/album.service";

import { Album } from "@main/album/models/album.model";
import { Artist } from "@main/artist/models/artist.model";
import { Music } from "@main/music/models/music.model";

import type { GraphQLContext } from "@main/graphql/types";

@Service()
@Resolver(() => Album)
export default class AlbumResolver {
    public constructor(private readonly albumService: AlbumService) {}

    @Query(() => Album, { nullable: true })
    public async album(@Arg("id", () => Int) id: number): Promise<Album | null> {
        return this.albumService.getItem(id);
    }

    @Query(() => [Album])
    public async albums() {
        return this.albumService.getItems();
    }

    @FieldResolver(() => [Artist])
    public async artists(@Root() album: Album, @Ctx() context: GraphQLContext) {
        return context.artistLoader.loadMany(album.artistIds);
    }

    @FieldResolver(() => [Artist])
    public async leadArtists(@Root() album: Album, @Ctx() context: GraphQLContext) {
        return context.artistLoader.loadMany(album.leadArtistIds);
    }

    @FieldResolver(() => [Music])
    public async musics(
        @Root() album: Album,
        @Ctx() context: GraphQLContext,
        @Arg("limit", () => Int, { nullable: true }) limit?: number,
    ) {
        const musicIds = limit ? album.musicIds.slice(0, limit) : album.musicIds;
        const data = await context.musicLoader.loadMany(musicIds);
        const musics: Music[] = [];
        for (const item of data) {
            if (!(item instanceof Music)) {
                continue;
            }

            musics.push(item);
        }

        return _.chain(musics)
            .orderBy(t => t.track || t.id, "asc")
            .value();
    }
}
