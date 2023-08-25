import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicService } from "@music/music.service";
import { MusicResolver } from "@music/music.resolver";

import { Music } from "@music/models/music.model";

@Module({
    imports: [TypeOrmModule.forFeature([Music])],
    providers: [MusicService, MusicResolver],
    exports: [MusicService],
})
export class MusicModule {}
