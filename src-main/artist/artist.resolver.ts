import _ from "lodash";

import { Arg, Ctx, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { Service } from "typedi";

import ArtistService from "@main/artist/artist.service";

import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";

import type { GraphQLContext } from "@main/graphql/types";

@Service()
@Resolver(() => Artist)
export default class ArtistResolver {
    public constructor(private readonly artistService: ArtistService) {}

    @Query(() => Artist, { nullable: true })
    public async artist(@Arg("id", () => Int) id: number) {
        return this.artistService.getItem(id);
    }

    @Query(() => [Artist])
    public async artists(): Promise<Artist[]> {
        return this.artistService.getItems();
    }

    @FieldResolver(() => [Album])
    public async albums(@Root() artist: Artist, @Ctx() ctx: GraphQLContext) {
        const albums = await ctx.albumLoader.loadMany(artist.albumIds);
        const items: Album[] = [];
        for (const album of albums) {
            if (!(album instanceof Album)) {
                //TODO: Throw error
                continue;
            }

            items.push(album);
        }

        return _.chain(items)
            .orderBy(a => a.year || 0, "desc")
            .value();
    }
}
