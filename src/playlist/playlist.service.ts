import { In, Repository } from "typeorm";

import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";

import { BaseService } from "@main/common/base.service";

import { Playlist } from "@main/playlist/models/playlist.model";
import { PlaylistRelation } from "@main/playlist/models/playlist-relation.model";
import { CreatePlaylistInput, UpdatePlaylistInput } from "@main/playlist/models/playlist.dto";
import { PLAYLIST_ADDED, PLAYLIST_REMOVED, PLAYLIST_UPDATED } from "@main/playlist/playlist.constants";

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

    public async create(input: CreatePlaylistInput, publish = true) {
        let playlist = this.playlistRepository.create({
            name: input.name,
        });

        playlist = await this.playlistRepository.save(playlist);

        if (publish) {
            pubsub.publish(PLAYLIST_ADDED, { playlistAdded: playlist });
        }

        return playlist;
    }
    public async createFromMusics({ name }: CreatePlaylistInput, musicIds: number[]) {
        const musics = await this.musicService.findByIds(musicIds);
        let playlist = await this.create({ name }, false);
        let newRelations = musics.map(music => {
            return this.playlistRelationRepository.create({ music, playlist });
        });

        newRelations = await this.playlistRelationRepository.save(newRelations);

        playlist.playlistRelations = newRelations;
        playlist = await this.playlistRepository.save(playlist);

        pubsub.publish(PLAYLIST_ADDED, { playlistAdded: playlist });

        return playlist;
    }

    public async addMusics(playlistId: number, musicIds: number[]) {
        let playlist = await this.findById(playlistId, ["playlistRelations"]);
        if (!playlist) {
            throw new Error("Playlist not found");
        }

        const musics = await this.musicService.findByIds(musicIds);
        let newRelations = musics.map(music => {
            return this.playlistRelationRepository.create({
                music,
                playlist,
            });
        });

        newRelations = await this.playlistRelationRepository.save(newRelations);
        playlist.playlistRelations = [...playlist.playlistRelations, ...newRelations];

        playlist = await this.playlistRepository.save(playlist);
        pubsub.publish(PLAYLIST_UPDATED, { playlistUpdated: playlist });

        return playlist;
    }

    public async update(id: number, input: UpdatePlaylistInput) {
        let playlist = await this.findById(id);
        if (!playlist) {
            throw new Error("Playlist not found");
        }

        playlist.name = input.name || playlist.name;
        playlist = await this.playlistRepository.save(playlist);

        pubsub.publish(PLAYLIST_UPDATED, { playlistUpdated: playlist });

        return playlist;
    }

    public async remove(id: number) {
        const playlist = await this.findById(id);
        if (!playlist) {
            throw new Error("Playlist not found");
        }

        await this.playlistRelationRepository.delete({
            id: In(playlist.playlistRelationIds),
        });

        await this.playlistRepository.delete(id);

        pubsub.publish(PLAYLIST_REMOVED, { playlistRemoved: id });

        return true;
    }
}
