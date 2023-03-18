import * as path from "path";
import * as fs from "fs-extra";
import sharp from "sharp";
import { Repository } from "typeorm";
import { AlbumArt as RawAlbumArt } from "@async3619/merry-go-round";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { AlbumArt } from "@main/album-art/models/album-art.model";

import { BaseService } from "@main/common/base.service";

import { ALBUM_ART_DIR } from "@main/constants";

@Injectable()
export class AlbumArtService extends BaseService<AlbumArt> {
    public constructor(@InjectRepository(AlbumArt) private readonly albumArtRepository: Repository<AlbumArt>) {
        super(albumArtRepository, AlbumArt);
    }

    public async create(rawAlbumArt: RawAlbumArt) {
        const { type, mimeType, description } = rawAlbumArt;
        const data = rawAlbumArt.data();
        const id = (await this.getLastId()) + 1;

        const targetPath = path.join(ALBUM_ART_DIR, `${id}.${mimeType.split("/")[1]}`);
        await fs.ensureDir(ALBUM_ART_DIR);
        await fs.writeFile(targetPath, data);

        const albumArt = this.albumArtRepository.create();
        albumArt.type = type as unknown as AlbumArt["type"];
        albumArt.mimeType = mimeType;
        albumArt.description = description;

        const { width, height } = await this.getImageSize(data);
        albumArt.width = width;
        albumArt.height = height;
        albumArt.size = data.length;
        albumArt.path = targetPath;

        return this.albumArtRepository.save(albumArt);
    }

    private async getImageSize(data: Buffer) {
        const metadata = await sharp(data).metadata();
        if (!metadata.width || !metadata.height) {
            throw new Error("Failed to get image size.");
        }

        return {
            width: metadata.width,
            height: metadata.height,
        };
    }
}
