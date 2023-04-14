import * as _ from "lodash";
import { In, Repository } from "typeorm";

import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Artist } from "@main/artist/models/artist.model";
import { ARTIST_PORTRAIT_ADDED } from "@main/artist/artist.constants";

import { BaseService } from "@main/common/base.service";
import { AlbumService } from "@main/album/album.service";
import { LibraryService } from "@main/library/library.service";
import { AlbumArtService } from "@main/album-art/album-art.service";

import pubSub from "@main/pubsub";

@Injectable()
export class ArtistService extends BaseService<Artist> {
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

        await pubSub.publish(ARTIST_PORTRAIT_ADDED, {
            artistPortraitAdded: targetArtist,
        });
    }

    public async create(name: string) {
        const artist = this.artistRepository.create();
        artist.name = name;

        return this.artistRepository.save(artist);
    }

    public async bulkEnsure(names: string[]) {
        const items = await this.artistRepository.find({
            where: {
                name: In(names),
            },
        });

        const itemMap: Record<string, Artist> = _.chain(items).keyBy("name").value();
        for (const name of names) {
            if (!itemMap[name]) {
                itemMap[name] = await this.create(name);
            }
        }

        return names.map(name => {
            if (!itemMap[name]) {
                throw new Error(`Failed to ensure artist '${name}'`);
            }

            return itemMap[name];
        });
    }
}
