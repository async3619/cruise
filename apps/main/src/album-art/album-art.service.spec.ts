import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { AlbumArtService } from "@album-art/album-art.service";

import { AlbumArt } from "@album-art/models/album-art.model";
import { Image } from "@image/models/image.model";

describe("AlbumArtService", () => {
    let service: AlbumArtService;
    let repository: Record<string, jest.Mock>;

    beforeEach(async () => {
        repository = {
            create: jest.fn().mockImplementation(p => p),
            save: jest.fn().mockImplementation(p => p),
            clear: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [AlbumArtService, { provide: getRepositoryToken(AlbumArt), useValue: repository }],
        }).compile();

        service = module.get<AlbumArtService>(AlbumArtService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to create an album art", () => {
        const image = {};
        const picture = { type: "type", description: "description" };
        const albumArt = service.create(image as Image, picture as any);

        expect(albumArt.image).toBe(image);
        expect(albumArt.type).toBe(picture.type);
        expect(albumArt.description).toBe(picture.description);
    });
});
