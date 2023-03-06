import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Service } from "typedi";

import AlbumService from "@main/album/album.service";

import { Album } from "@main/album/models/album.model";
import { Artist } from "@main/artist/models/artist.model";

import type { GraphQLContext } from "@main/graphql/types";

@Service()
@Resolver(() => Album)
export default class AlbumResolver {
    public constructor(private readonly albumService: AlbumService) {}

    @FieldResolver(() => [Artist])
    public async artists(@Root() album: Album, @Ctx() context: GraphQLContext) {
        return context.artistLoader.loadMany(album.artistIds);
    }
}
