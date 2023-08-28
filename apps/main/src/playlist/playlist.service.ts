import { Repository } from "typeorm";

import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { MusicService } from "@music/music.service";

import { Playlist } from "@playlist/models/playlist.model";

@Injectable()
export class PlaylistService {
    public constructor(
        @InjectRepository(Playlist) private readonly playlistRepository: Repository<Playlist>,
        @Inject(MusicService) private readonly musicService: MusicService,
    ) {}

    public findAll(): Promise<Playlist[]> {
        return this.playlistRepository.find();
    }

    public async createFromMusicIds(name: string, musicIds: number[]): Promise<Playlist> {
        let playlist = await this.playlistRepository.findOne({ where: { name } });
        if (playlist) {
            throw new Error(`Playlist with name '${name}' already exists`);
        }

        const musics = await this.musicService.findByIds(musicIds);
        playlist = this.playlistRepository.create({ name, musics });

        return this.playlistRepository.save(playlist);
    }
}
