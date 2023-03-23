import fs from "fs-extra";
import { Repository } from "typeorm";

import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";
import { UpdateAlbumInput } from "@main/album/models/update-album.input";

import { BaseService } from "@main/common/base.service";
import { MusicService } from "@main/music/music.service";
import { ArtistService } from "@main/artist/artist.service";
import { AlbumArtService } from "@main/album-art/album-art.service";
import { LibraryService } from "@main/library/library.service";

@Injectable()
export class AlbumService extends BaseService<Album> {
    public constructor(
        @InjectRepository(Album) private readonly albumRepository: Repository<Album>,
        @Inject(MusicService) private readonly musicService: MusicService,
        @Inject(ArtistService) private readonly artistService: ArtistService,
        @Inject(AlbumArtService) private readonly albumArtService: AlbumArtService,
        @Inject(forwardRef(() => LibraryService)) private readonly libraryService: LibraryService,
    ) {
        super(albumRepository, Album);
    }

    public async findLeadAlbumsByArtist(artistId: number) {
        const allAlbums = await this.findAll();

        return allAlbums.filter(album => album.leadArtistIds.includes(artistId));
    }

    public async create(title: string, artists: Artist[], leadArtists: Artist[]) {
        const album = this.albumRepository.create();
        album.title = title;
        album.artists = artists;
        album.leadArtists = leadArtists;

        return this.albumRepository.save(album);
    }
    public async updateAlbum(id: number, data: UpdateAlbumInput) {
        const album = await this.findById(id, ["artists", "leadArtists", "musics"]);
        if (!album) {
            throw new Error(`Album with id '${id}' not found`);
        }

        // check if album art files exist
        for (const albumArt of data.albumArts) {
            if (!fs.existsSync(albumArt.path)) {
                throw new Error(`Album art file '${albumArt.path}' does not exist`);
            }
        }

        album.leadArtists = await this.artistService.bulkEnsure(data.albumArtists);
        album.title = data.title;
        album.albumArts = [];
        for (const albumArt of data.albumArts) {
            const item = await this.albumArtService.ensureFromPath(albumArt.path);
            item.type = albumArt.type;
            item.description = albumArt.description || "";

            album.albumArts.push(item);
        }

        await this.musicService.bulkUpdate(album.musicIds, {
            genre: data.genre,
            year: data.year ? parseInt(data.year, 10) : null,
            albumArts: album.albumArts,
        });

        const result = await this.albumRepository.save(album);
        this.libraryService.updateTracks(result);

        return result;
    }
    public async setAlbumArts(id: number, albumArts: AlbumArt[]) {
        const album = await this.findById(id, ["albumArts"]);
        if (!album) {
            throw new Error(`Album with id '${id}' not found`);
        }

        album.albumArts = albumArts;

        return this.albumRepository.save(album);
    }
}
