import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AlbumArtService } from "@album-art/album-art.service";
import { AlbumArtResolver } from "@album-art/album-art.resolver";

import { AlbumArt } from "@album-art/models/album-art.model";
import { ElectronModule } from "@electron/electron.module";

@Module({
    imports: [TypeOrmModule.forFeature([AlbumArt]), ElectronModule],
    providers: [AlbumArtService, AlbumArtResolver],
    exports: [AlbumArtService],
})
export class AlbumArtModule {}
