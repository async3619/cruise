import { Inject } from "@nestjs/common";
import { Context, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { ElectronService } from "@electron/electron.service";

import { AlbumArt } from "@album-art/models/album-art.model";

import { GraphQLContext } from "@root/context";

@Resolver(() => AlbumArt)
export class AlbumArtResolver {
    public constructor(@Inject(ElectronService) private readonly electronService: ElectronService) {}

    @ResolveField(() => String)
    public async url(
        @Parent() parent: AlbumArt,
        @Context("loaders") loaders: GraphQLContext["loaders"],
    ): Promise<string> {
        const image = await loaders.image.load(parent.imageId);

        return this.electronService.getElectronUrl(image.path);
    }
}
