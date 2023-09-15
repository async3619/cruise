import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AlbumService } from "@album/album.service";
import { AlbumResolver } from "@album/album.resolver";

import { Album } from "@album/models/album.model";

@Module({
    imports: [TypeOrmModule.forFeature([Album])],
    providers: [AlbumService, AlbumResolver],
    exports: [AlbumService],
})
export class AlbumModule {}
