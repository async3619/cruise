import { Test, TestingModule } from "@nestjs/testing";

import { AlbumArtService } from "@main/album-art/album-art.service";

describe("AlbumArtService", () => {
    let service: AlbumArtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AlbumArtService],
        }).compile();

        service = module.get<AlbumArtService>(AlbumArtService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
