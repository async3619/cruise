import { Repository } from "typeorm";

import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { PlayingLog } from "@main/log/models/playing-logs.model";
import { Music } from "@main/music/models/music.model";

import { BaseService } from "@main/common/base.service";
import { MusicService } from "@main/music/music.service";

export interface LogServicePubSub {
    playingLogCreated: PlayingLog;
}

@Injectable()
export class LogService extends BaseService<PlayingLog, LogServicePubSub> {
    public constructor(
        @InjectRepository(PlayingLog) private readonly playingLogRepository: Repository<PlayingLog>,
        @Inject(MusicService) private readonly musicService: MusicService,
    ) {
        super(playingLogRepository, PlayingLog);
    }

    public async create(musicId: Music["id"]): Promise<void> {
        const music = await this.musicService.findById(musicId);
        if (!music) {
            throw new Error(`Music with id ${musicId} not found.`);
        }

        const log = new PlayingLog();
        log.music = music;

        const item = await this.playingLogRepository.save(log);
        await this.publish("playingLogCreated", item);
    }
}
