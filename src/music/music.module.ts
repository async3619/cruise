import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicService } from "@main/music/music.service";
import { MusicResolver } from "@main/music/music.resolver";

import { Music } from "@main/music/models/music.model";

@Module({
    imports: [TypeOrmModule.forFeature([Music])],
    providers: [MusicService, MusicResolver],
    exports: [MusicService],
})
export class MusicModule {}
