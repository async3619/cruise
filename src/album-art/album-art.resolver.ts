import { Inject } from "@nestjs/common";
import { Mutation, Resolver } from "@nestjs/graphql";

import { ElectronService } from "@main/electron/electron.service";
import { AlbumArtService } from "@main/album-art/album-art.service";

import { AlbumArt } from "@main/album-art/models/album-art.model";

import type { Nullable } from "@common/types";

@Resolver(() => AlbumArt)
export class AlbumArtResolver {
    public constructor(
        @Inject(ElectronService) private readonly electronService: ElectronService,
        @Inject(AlbumArtService) private readonly albumArtService: AlbumArtService,
    ) {}

    @Mutation(() => AlbumArt, { nullable: true })
    public async selectAlbumArtFile(): Promise<Nullable<AlbumArt>> {
        const targetPath = await this.electronService.selectPath({
            directory: false,
            multiple: false,
            filters: [{ name: "Album Art Images", extensions: ["jpg", "jpeg", "png", "bmp"] }],
        });

        if (!targetPath) {
            return null;
        }

        return this.albumArtService.createFromPath(targetPath[0], false);
    }
}
