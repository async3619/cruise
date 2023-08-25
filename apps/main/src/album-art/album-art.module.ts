import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AlbumArtService } from "@album-art/album-art.service";

import { AlbumArt } from "@album-art/models/album-art.model";

@Module({
    imports: [TypeOrmModule.forFeature([AlbumArt])],
    providers: [AlbumArtService],
    exports: [AlbumArtService],
})
export class AlbumArtModule {}
