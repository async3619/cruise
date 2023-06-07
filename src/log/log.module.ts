import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicModule } from "@main/music/music.module";

import { LogResolver } from "@main/log/log.resolver";
import { LogService } from "@main/log/log.service";

import { PlayingLog } from "@main/log/models/playing-logs.model";

@Module({
    imports: [TypeOrmModule.forFeature([PlayingLog]), MusicModule],
    providers: [LogService, LogResolver],
})
export class LogModule {}
