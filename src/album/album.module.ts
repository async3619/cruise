import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicModule } from "@main/music/music.module";

import { AlbumService } from "@main/album/album.service";
import { AlbumResolver } from "@main/album/album.resolver";
import { ArtistModule } from "@main/artist/artist.module";

import { Album } from "@main/album/models/album.model";

@Module({
    imports: [TypeOrmModule.forFeature([Album]), MusicModule, ArtistModule],
    providers: [AlbumService, AlbumResolver],
    exports: [AlbumService],
})
export class AlbumModule {}
