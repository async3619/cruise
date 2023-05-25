import { In, Repository } from "typeorm";

import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";

import { BaseService } from "@main/common/base.service";

import { Playlist } from "@main/playlist/models/playlist.model";
import { PlaylistRelation } from "@main/playlist/models/playlist-relation.model";
import { CreatePlaylistInput } from "@main/playlist/models/playlist.dto";
import { PLAYLIST_ADDED } from "@main/playlist/playlist.constants";

import { MusicService } from "@main/music/music.service";
import { Music } from "@main/music/models/music.model";

import pubsub from "@main/pubsub";

@Injectable()
export class PlaylistService extends BaseService<Playlist> {
    public constructor(
        @InjectRepository(Playlist) private readonly playlistRepository: Repository<Playlist>,
        @InjectRepository(PlaylistRelation) private readonly playlistRelationRepository: Repository<PlaylistRelation>,
        @Inject(MusicService) private readonly musicService: MusicService,
    ) {
        super(playlistRepository, Playlist);
    }

    public async getMusics(playlist: Playlist): Promise<Music[]> {
        const relations = await this.playlistRelationRepository.findBy({
            id: In(playlist.playlistRelationIds),
        });

        const musicIds = relations.map(item => item.musicId);
        return this.musicService.findByIds(musicIds);
    }

    public async create(input: CreatePlaylistInput) {
        let playlist = this.playlistRepository.create({
            name: input.name,
        });

        playlist = await this.playlistRepository.save(playlist);
        pubsub.publish(PLAYLIST_ADDED, { playlistAdded: playlist });

        return playlist;
    }
}
