import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicService } from "@music/music.service";

import { Music } from "@music/models/music.model";

@Module({
    imports: [TypeOrmModule.forFeature([Music])],
    providers: [MusicService],
    exports: [MusicService],
})
export class MusicModule {}
