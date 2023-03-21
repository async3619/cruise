import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicModule } from "@main/music/music.module";
import { ArtistModule } from "@main/artist/artist.module";
import { AlbumArtModule } from "@main/album-art/album-art.module";

import { AlbumService } from "@main/album/album.service";
import { AlbumResolver } from "@main/album/album.resolver";

import { Album } from "@main/album/models/album.model";

@Module({
    imports: [TypeOrmModule.forFeature([Album]), MusicModule, ArtistModule, AlbumArtModule],
    providers: [AlbumService, AlbumResolver],
    exports: [AlbumService],
})
export class AlbumModule {}
