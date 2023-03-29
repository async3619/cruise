import { forwardRef, Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicService } from "@main/music/music.service";
import { MusicResolver } from "@main/music/music.resolver";

import { Music } from "@main/music/models/music.model";
import { AlbumModule } from "@main/album/album.module";

@Module({
    imports: [TypeOrmModule.forFeature([Music]), forwardRef(() => AlbumModule)],
    providers: [MusicService, MusicResolver],
    exports: [MusicService],
})
export class MusicModule {}
