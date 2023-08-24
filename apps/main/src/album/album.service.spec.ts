import { getRepositoryToken } from "@nestjs/typeorm";
import { Test, TestingModule } from "@nestjs/testing";

import { AlbumService } from "@album/album.service";

import { Album } from "@album/models/album.model";

describe("AlbumService", () => {
    let service: AlbumService;
    let repository: Record<string, jest.Mock>;

    beforeEach(async () => {
        repository = {
            create: jest.fn().mockReturnValue({}),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [AlbumService, { provide: getRepositoryToken(Album), useValue: repository }],
        }).compile();

        service = module.get<AlbumService>(AlbumService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to create album object", () => {
        const title = "test";
        const album = service.create(title);

        expect(album.title).toBe(title);
        expect(album.artists).toStrictEqual([]);
        expect(album.albumArtists).toStrictEqual([]);
    });
});
