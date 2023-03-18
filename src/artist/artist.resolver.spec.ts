import { Test, TestingModule } from "@nestjs/testing";

import { ArtistResolver } from "@main/artist/artist.resolver";

describe("ArtistResolver", () => {
    let resolver: ArtistResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ArtistResolver],
        }).compile();

        resolver = module.get<ArtistResolver>(ArtistResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
