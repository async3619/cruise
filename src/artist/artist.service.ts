import * as _ from "lodash";
import { In, Repository } from "typeorm";

import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Artist } from "@main/artist/models/artist.model";

import { BaseService } from "@main/common/base.service";
import { AlbumService } from "@main/album/album.service";
import { LibraryService } from "@main/library/library.service";
import { AlbumArtService } from "@main/album-art/album-art.service";
import { EnsureResult } from "@main/utils/types";

interface ArtistPubSub {
    artistPortraitAdded: Artist;
    artistsDataUpdated: boolean;
}

@Injectable()
export class ArtistService extends BaseService<Artist, ArtistPubSub> {
    public constructor(
        @InjectRepository(Artist) private readonly artistRepository: Repository<Artist>,
        @Inject(forwardRef(() => AlbumService)) private readonly albumService: AlbumService,
        @Inject(forwardRef(() => LibraryService)) private readonly libraryService: LibraryService,
        @Inject(AlbumArtService) private readonly albumArtService: AlbumArtService,
    ) {
        super(artistRepository, Artist);
    }

    public async findLeadArtists() {
        const albums = await this.albumService.findAll();
        const artistIds = _.chain(albums).map("leadArtistIds").flatten().uniq().value();

        return this.findByIds(artistIds);
    }

    public async fetchPortrait(artist: Artist) {
        const targetArtist = await this.findById(artist.id);
        if (!targetArtist) {
            throw new Error("Artist with given id does not exist.");
        }

        const portrait = await this.libraryService.searchArtistPortrait(artist);
        if (!portrait) {
            return;
        }

        const largestPortrait = _.maxBy(portrait, "width");
        if (!largestPortrait) {
            return;
        }

        const albumArt = await this.albumArtService.createFromUrl(largestPortrait.url);
        if (!albumArt) {
            return;
        }

        targetArtist.portrait = albumArt;
        await this.artistRepository.save(targetArtist);

        this.publish("artistPortraitAdded", targetArtist);
    }

    public async create(name: string) {
        const artist = this.artistRepository.create();
        artist.name = name;

        return this.artistRepository.save(artist);
    }

    public async bulkEnsure(names: string[]): Promise<EnsureResult<Artist>[]> {
        names = _.uniq(names);
        const artists = await this.artistRepository.find({
            where: { name: In(names) },
        });

        const existingNames = artists.map(artist => artist.name);
        const newNames = _.difference(names, existingNames);

        const newArtists: EnsureResult<Artist>[] = [];
        for (const name of newNames) {
            const artist = this.artistRepository.create();
            artist.name = name;

            const item = await this.artistRepository.save(artist);
            newArtists.push({ created: true, item });
        }

        return [...artists.map(artist => ({ created: false, item: artist })), ...newArtists];
    }
}
