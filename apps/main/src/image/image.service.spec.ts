import fs from "fs-extra";
import rawFs from "fs/promises";
import * as mm from "music-metadata";

import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { IMAGE_PATH, ImageService } from "@image/image.service";

import { Image } from "@image/models/image.model";
import path from "path";

describe("ImageService", () => {
    let service: ImageService;
    let repository: Record<string, jest.Mock>;

    beforeEach(async () => {
        repository = {
            findOne: jest.fn(),
            create: jest.fn().mockImplementation(p => p),
            save: jest.fn().mockImplementation(p => p),
            clear: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [ImageService, { provide: getRepositoryToken(Image), useValue: repository }],
        }).compile();

        service = module.get<ImageService>(ImageService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should ensure image directory exists on application bootstrap", async () => {
        await service.onApplicationBootstrap();

        expect(fs.ensureDir).toHaveBeenCalledWith(IMAGE_PATH);
    });

    it("should create an image if there is no same image on records", async () => {
        repository.findOne.mockResolvedValue(undefined);

        const buffer = await rawFs.readFile(path.join(process.cwd(), "test", "fixtures", "4.1.05.png"));
        const picture: mm.IPicture = {
            data: buffer,
            format: "image/png",
            type: "Cover (front)",
            description: "front",
        };

        const result = await service.ensure(picture, "test");

        expect(result).toEqual({
            bucketName: "test",
            format: "png",
            mimeType: "image/png",
            path: expect.any(String),
            hash: expect.any(String),
            height: 200,
            width: 200,
            size: buffer.length,
        });

        expect(repository.save).toHaveBeenCalled();
    });

    it("should not create an image if there is same image on records", async () => {
        const data = {
            id: 1,
            bucketName: "test",
            format: "png",
            mimeType: "image/png",
            path: expect.any(String),
            hash: expect.any(String),
            height: 20000,
            width: 20000,
            size: 10000,
        };

        repository.findOne.mockResolvedValue(data);

        const buffer = await rawFs.readFile(path.join(process.cwd(), "test", "fixtures", "4.1.05.png"));
        const picture: mm.IPicture = {
            data: buffer,
            format: "image/png",
            type: "Cover (front)",
            description: "front",
        };

        const result = await service.ensure(picture, "test");

        expect(result).toEqual(data);
    });
});
