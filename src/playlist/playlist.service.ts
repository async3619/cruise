import { In, Repository } from "typeorm";

import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";

import { BaseService } from "@main/common/base.service";

import { Playlist } from "@main/playlist/models/playlist.model";
import { PlaylistRelation } from "@main/playlist/models/playlist-relation.model";
import { CreatePlaylistInput, UpdatePlaylistInput } from "@main/playlist/models/playlist.dto";

import { MusicService } from "@main/music/music.service";
import { Music } from "@main/music/models/music.model";

export interface PlaylistPubSub {
    playlistAdded: Playlist;
    playlistUpdated: Playlist;
    playlistRemoved: number;
}

@Injectable()
export class PlaylistService extends BaseService<Playlist, PlaylistPubSub> {
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
            this.publish("playlistAdded", playlist);
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

        this.publish("playlistAdded", playlist);
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
        this.publish("playlistUpdated", playlist);

        return playlist;
    }

    public async update(id: number, input: UpdatePlaylistInput) {
        let playlist = await this.findById(id);
        if (!playlist) {
            throw new Error("Playlist not found");
        }

        playlist.name = input.name || playlist.name;
        playlist = await this.playlistRepository.save(playlist);

        this.publish("playlistUpdated", playlist);

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

        this.publish("playlistRemoved", id);
        return true;
    }

    public async deleteMusicsByIndices(playlistId: number, indices: number[]) {
        let item = await this.findById(playlistId, ["playlistRelations"]);
        if (!item) {
            throw new Error("Playlist not found");
        }

        const removedRelations = item.playlistRelations.filter((_, index) => indices.includes(index));
        item.playlistRelations = item.playlistRelations.filter((_, index) => !indices.includes(index));

        item = await this.playlistRepository.save(item);
        await this.playlistRelationRepository.delete({
            id: In(removedRelations.map(item => item.id)),
        });

        this.publish("playlistUpdated", item);
        return item;
    }

    public async deleteMusics(musicIds: number[]) {
        const targetRelations = await this.playlistRelationRepository
            .createQueryBuilder("r")
            .where("`r`.`musicId` IN (:...musicIds)", { musicIds })
            .getMany();

        const relationIds = targetRelations.map(item => item.id);
        await this.playlistRelationRepository.delete({
            id: In(relationIds),
        });

        const playlistIds = targetRelations.map(item => item.playlistId);
        const playlists = await this.playlistRepository.findBy({
            id: In(playlistIds),
        });

        for (const playlist of playlists) {
            this.publish("playlistUpdated", playlist);
        }
    }
}
