import * as _ from "lodash";
import { In, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Artist } from "@main/artist/models/artist.model";

import { BaseService } from "@main/common/base.service";

@Injectable()
export class ArtistService extends BaseService<Artist> {
    public constructor(@InjectRepository(Artist) private readonly artistRepository: Repository<Artist>) {
        super(artistRepository, Artist);
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
