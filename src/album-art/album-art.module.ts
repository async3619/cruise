import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ElectronModule } from "@main/electron/electron.module";

import { AlbumArtService } from "@main/album-art/album-art.service";
import { AlbumArtResolver } from "@main/album-art/album-art.resolver";

import { AlbumArt } from "@main/album-art/models/album-art.model";

@Module({
    imports: [TypeOrmModule.forFeature([AlbumArt]), ElectronModule],
    providers: [AlbumArtService, AlbumArtResolver],
    exports: [AlbumArtService],
})
export class AlbumArtModule {}
