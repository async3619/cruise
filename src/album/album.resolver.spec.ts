import { Test, TestingModule } from "@nestjs/testing";

import { AlbumResolver } from "@main/album/album.resolver";

describe("AlbumResolver", () => {
    let resolver: AlbumResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AlbumResolver],
        }).compile();

        resolver = module.get<AlbumResolver>(AlbumResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
