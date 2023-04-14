import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AlbumModule } from "@main/album/album.module";
import { LibraryModule } from "@main/library/library.module";
import { ElectronModule } from "@main/electron/electron.module";
import { AlbumArtModule } from "@main/album-art/album-art.module";

import { ArtistService } from "@main/artist/artist.service";
import { ArtistResolver } from "@main/artist/artist.resolver";

import { Artist } from "@main/artist/models/artist.model";

@Module({
    imports: [
        TypeOrmModule.forFeature([Artist]),
        forwardRef(() => AlbumModule),
        forwardRef(() => LibraryModule),
        ElectronModule,
        AlbumArtModule,
    ],
    providers: [ArtistService, ArtistResolver],
    exports: [ArtistService],
})
export class ArtistModule {}
