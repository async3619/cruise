import * as _ from "lodash";
import { In, Repository } from "typeorm";

import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Artist } from "@main/artist/models/artist.model";

import { BaseService } from "@main/common/base.service";
import { AlbumService } from "@main/album/album.service";

@Injectable()
export class ArtistService extends BaseService<Artist> {
    public constructor(
        @InjectRepository(Artist) private readonly artistRepository: Repository<Artist>,
        @Inject(forwardRef(() => AlbumService)) private readonly albumService: AlbumService,
    ) {
        super(artistRepository, Artist);
    }

    public async findLeadArtists() {
        const albums = await this.albumService.findAll();
        const artistIds = _.chain(albums).map("leadArtistIds").flatten().uniq().value();

        return this.findByIds(artistIds);
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
