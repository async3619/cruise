import { Repository } from "typeorm";
import * as path from "path";

import { Audio } from "@async3619/merry-go-round";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Music } from "@main/music/models/music.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";
import { Album } from "@main/album/models/album.model";
import { Artist } from "@main/artist/models/artist.model";

import { BaseService } from "@main/common/base.service";

import { Nullable } from "@common/types";

@Injectable()
export class MusicService extends BaseService<Music> {
    public constructor(@InjectRepository(Music) private readonly musicRepository: Repository<Music>) {
        super(musicRepository, Music);
    }

    public async create(
        audio: Audio,
        filePath: string,
        albumArts: AlbumArt[],
        album: Nullable<Album>,
        featuredArtists: Artist[],
    ) {
        const fileName = path.basename(filePath);
        const music = this.musicRepository.create();
        music.title = audio.title || fileName;
        music.albumArtist = audio.albumArtist;
        music.genre = audio.genre;
        music.year = audio.year;
        music.track = audio.track;
        music.disc = audio.disc;
        music.duration = audio.duration;
        music.path = filePath;
        music.albumArts = albumArts;
        music.album = album;
        music.artists = featuredArtists;

        return this.musicRepository.save(music);
    }
}