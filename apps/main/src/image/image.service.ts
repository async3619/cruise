import * as mm from "music-metadata";
import * as blake2 from "blake2";
import { Repository } from "typeorm";
import sharp from "sharp";
import path from "path";
import os from "os";
import fs from "fs-extra";
import { v4 as generateUuid } from "uuid";
import { fromBuffer } from "file-type";

import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Image } from "@image/models/image.model";

export const IMAGE_PATH = path.join(os.homedir(), ".cruise", "images");

@Injectable()
export class ImageService implements OnApplicationBootstrap {
    public constructor(@InjectRepository(Image) private readonly imageRepository: Repository<Image>) {}

    public async onApplicationBootstrap() {
        await fs.ensureDir(IMAGE_PATH);
    }

    public async ensure(picture: mm.IPicture, bucketName: string) {
        const metadata = await sharp(picture.data).metadata();
        if (!metadata.format || !metadata.width || !metadata.height) {
            throw new Error("Failed to detect image metadata");
        }

        const type = await fromBuffer(picture.data);
        if (!type) {
            throw new Error("Failed to detect image type");
        }

        const hash = this.hashBuffer(picture.data);
        let image = await this.imageRepository.findOne({
            where: {
                hash,
                bucketName,
                mimeType: type.mime,
                width: metadata.width,
                height: metadata.height,
                size: picture.data.length,
            },
        });

        if (!image) {
            const filePath = path.join(IMAGE_PATH, bucketName, `${generateUuid()}.${type.ext}`);
            await fs.ensureDir(path.dirname(filePath));
            await fs.writeFile(filePath, picture.data);

            image = this.imageRepository.create({
                hash,
                bucketName,
                path: filePath,
                mimeType: type.mime,
                width: metadata.width,
                height: metadata.height,
                format: metadata.format,
                size: picture.data.length,
            });

            await this.imageRepository.save(image);
        }

        return image;
    }

    public hashBuffer(buffer: Buffer) {
        return blake2.createHash("blake2b", { digestLength: 32 }).update(buffer).digest("hex");
    }
}
