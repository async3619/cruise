import { Repository } from "typeorm";
import * as mm from "music-metadata";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { BaseService } from "@base/base.service";

import { Music } from "@music/models/music.model";

type MusicCreationArgs = [metadata: mm.IAudioMetadata, filePath: string];

@Injectable()
export class MusicService extends BaseService<Music, MusicCreationArgs> {
    public constructor(@InjectRepository(Music) private readonly musicRepository: Repository<Music>) {
        super(musicRepository);
    }

    public create(metadata: mm.IAudioMetadata, filePath: string) {
        return this.musicRepository.create({
            title: metadata.common.title,
            artist: metadata.common.artist,
            artists: metadata.common.artists ?? [],
            albumTitle: metadata.common.album,
            albumArtist: metadata.common.albumartist,
            genre: metadata.common.genre ?? [],
            year: metadata.common.year,
            trackNumber: metadata.common.track.no,
            discNumber: metadata.common.disk.no,
            duration: metadata.format.duration,
            filePath,
        });
    }
}
