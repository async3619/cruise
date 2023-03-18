import { Test, TestingModule } from "@nestjs/testing";

import { AlbumArtResolver } from "@main/album-art/album-art.resolver";

describe("AlbumArtResolver", () => {
    let resolver: AlbumArtResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AlbumArtResolver],
        }).compile();

        resolver = module.get<AlbumArtResolver>(AlbumArtResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
