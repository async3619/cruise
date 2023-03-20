import { Repository } from "typeorm";

import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { UpdateAlbumInput } from "@main/album/models/update-album.input";

import { BaseService } from "@main/common/base.service";
import { MusicService } from "@main/music/music.service";
import { ArtistService } from "@main/artist/artist.service";

@Injectable()
export class AlbumService extends BaseService<Album> {
    public constructor(
        @InjectRepository(Album) private readonly albumRepository: Repository<Album>,
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(ArtistService) private readonly artistService: ArtistService,
    ) {
        super(albumRepository, Album);
    }

    public async create(title: string, artists: Artist[], leadArtists: Artist[]) {
        const album = this.albumRepository.create();
        album.title = title;
        album.artists = artists;
        album.leadArtists = leadArtists;

        return this.albumRepository.save(album);
    }

    public async update(id: number, data: UpdateAlbumInput) {
        const album = await this.findById(id, ["artists", "leadArtists", "musics"]);
        if (!album) {
            throw new Error(`Album with id '${id}' not found`);
        }

        album.leadArtists = await this.artistService.bulkEnsure(data.albumArtists);
        album.title = data.title;

        await this.musicService.bulkUpdate(album.musicIds, {
            genre: data.genre,
            year: data.year ? parseInt(data.year, 10) : null,
        });

        return this.albumRepository.save(album);
    }
}
