import { Repository } from "typeorm";
import * as mm from "music-metadata";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { BaseService } from "@base/base.service";

import { Music } from "@music/models/Music.model";

type MusicCreationArgs = [metadata: mm.IAudioMetadata, filePath: string];

@Injectable()
export class MusicService extends BaseService<Music, MusicCreationArgs> {
    public constructor(@InjectRepository(Music) private readonly musicRepository: Repository<Music>) {
        super(musicRepository);
    }

    public create(metadata: mm.IAudioMetadata, filePath: string) {
        const music = this.musicRepository.create();
        music.title = metadata.common.title;
        music.artist = metadata.common.artist;
        music.artists = metadata.common.artists ?? [];
        music.album = metadata.common.album;
        music.albumArtist = metadata.common.albumartist;
        music.genre = metadata.common.genre ?? [];
        music.year = metadata.common.year;
        music.trackNumber = metadata.common.track.no;
        music.discNumber = metadata.common.disk.no;
        music.duration = metadata.format.duration;
        music.filePath = filePath;

        return music;
    }
}
