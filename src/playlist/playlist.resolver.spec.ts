import { Test, TestingModule } from "@nestjs/testing";
import { PlaylistResolver } from "./playlist.resolver";

describe("PlaylistResolver", () => {
    let resolver: PlaylistResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PlaylistResolver],
        }).compile();

        resolver = module.get<PlaylistResolver>(PlaylistResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
