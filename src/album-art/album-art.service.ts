import * as path from "path";
import * as fs from "fs-extra";
import sharp from "sharp";
import { Repository } from "typeorm";
import { AlbumArt as RawAlbumArt } from "@async3619/merry-go-round";
import { fromBuffer } from "file-type";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { AlbumArt, AlbumArtType } from "@main/album-art/models/album-art.model";

import { BaseService } from "@main/common/base.service";

import checksum from "@main/utils/checksum";
import { ALBUM_ART_DIR } from "@main/constants";

@Injectable()
export class AlbumArtService extends BaseService<AlbumArt> {
    public constructor(@InjectRepository(AlbumArt) private readonly albumArtRepository: Repository<AlbumArt>) {
        super(albumArtRepository, AlbumArt);
    }

    public async bulkEnsure(rawAlbumArts: RawAlbumArt[]) {
        const result: AlbumArt[] = [];
        for (const rawAlbumArt of rawAlbumArts) {
            result.push(await this.ensure(rawAlbumArt));
        }

        return result;
    }
    public async ensure(rawAlbumArt: RawAlbumArt) {
        const { type, mimeType, description } = rawAlbumArt;
        const data = rawAlbumArt.data();
        const checksumString = checksum(data);

        let albumArt = await this.albumArtRepository.findOne({
            where: {
                checksum: checksumString,
            },
        });

        if (albumArt) {
            return albumArt;
        }

        const id = (await this.getLastId()) + 1;

        const targetPath = path.join(ALBUM_ART_DIR, `${id}.${mimeType.split("/")[1]}`);
        await fs.ensureDir(ALBUM_ART_DIR);
        await fs.writeFile(targetPath, data);

        albumArt = this.albumArtRepository.create();
        albumArt.type = type as unknown as AlbumArt["type"];
        albumArt.mimeType = mimeType;
        albumArt.description = description;

        const { width, height } = await this.getImageSize(data);
        albumArt.width = width;
        albumArt.height = height;
        albumArt.size = data.length;
        albumArt.path = targetPath;
        albumArt.checksum = checksumString;

        return this.albumArtRepository.save(albumArt);
    }
    public async ensureFromPath(path: string) {
        let albumArt = await this.albumArtRepository.findOne({
            where: {
                path,
            },
        });

        if (!albumArt) {
            albumArt = await this.createFromPath(path);
        }

        return albumArt;
    }

    public async createFromPath(targetPath: string, writeOnDatabase = true, copyToAlbumArtDir = true) {
        const data = await fs.readFile(targetPath);
        const mimeType = await fromBuffer(data);
        if (!mimeType) {
            throw new Error("Failed to get file type.");
        }

        if (!mimeType.mime.startsWith("image/")) {
            throw new Error("Given file is not an image.");
        }

        const { width, height } = await this.getImageSize(data);
        const checksumString = checksum(data);
        const id = (await this.getLastId()) + 1;

        if (copyToAlbumArtDir) {
            targetPath = path.join(ALBUM_ART_DIR, `${id}.${mimeType.mime.split("/")[1]}`);
            await fs.ensureDir(ALBUM_ART_DIR);
            await fs.writeFile(targetPath, data);
        }

        const albumArt = this.albumArtRepository.create();
        albumArt.id = id;
        albumArt.type = AlbumArtType.CoverFront;
        albumArt.mimeType = mimeType.mime;
        albumArt.description = "";
        albumArt.width = width;
        albumArt.height = height;
        albumArt.size = data.length;
        albumArt.path = targetPath;
        albumArt.checksum = checksumString;

        if (writeOnDatabase) {
            return this.albumArtRepository.save(albumArt);
        }

        return albumArt;
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
