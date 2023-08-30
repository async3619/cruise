import { Repository } from "typeorm";
import { PubSub } from "graphql-subscriptions";

import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { MusicService } from "@music/music.service";

import { Playlist } from "@playlist/models/playlist.model";

export enum PlaylistEvents {
    CREATED = "PLAYLIST_CREATED",
    UPDATED = "PLAYLIST_UPDATED",
    DELETED = "PLAYLIST_DELETED",
}

@Injectable()
export class PlaylistService {
    private readonly pubSub = new PubSub();

    public constructor(
        @InjectRepository(Playlist) private readonly playlistRepository: Repository<Playlist>,
        @Inject(MusicService) private readonly musicService: MusicService,
    ) {}

    public findById(id: number): Promise<Playlist | null> {
        return this.playlistRepository.findOne({ where: { id } });
    }
    public findAll(): Promise<Playlist[]> {
        return this.playlistRepository.find();
    }

    public async createFromMusicIds(name: string, musicIds: number[]): Promise<Playlist> {
        let playlist = await this.playlistRepository.findOne({ where: { name } });
        if (playlist) {
            throw new Error(`Playlist with name '${name}' already exists`);
        }

        const musics = await this.musicService.findByIds(musicIds);
        playlist = this.playlistRepository.create({ name, musicIds: musics.map(m => m.id) });
        playlist = await this.playlistRepository.save(playlist);

        this.pubSub.publish(PlaylistEvents.CREATED, { [PlaylistEvents.CREATED]: playlist });
        return playlist;
    }
    public async addMusicsToPlaylist(playlistId: number, musicIds: number[]): Promise<void> {
        const playlist = await this.playlistRepository.findOne({ where: { id: playlistId } });
        if (!playlist) {
            throw new Error(`Playlist with id '${playlistId}' does not exist`);
        }

        const musics = await this.musicService.findByIds(musicIds);
        playlist.musicIds = [...(playlist.musicIds ?? []), ...musics.map(m => m.id)];
        await this.playlistRepository.save(playlist);

        this.pubSub.publish(PlaylistEvents.UPDATED, { [PlaylistEvents.UPDATED]: playlist });
    }

    public async delete(id: number): Promise<void> {
        await this.playlistRepository.delete({ id });
        this.pubSub.publish(PlaylistEvents.DELETED, { [PlaylistEvents.DELETED]: id });
    }

    public asyncIterator(event: PlaylistEvents) {
        return this.pubSub.asyncIterator(event);
    }
}
