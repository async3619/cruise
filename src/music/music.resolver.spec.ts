import { Test, TestingModule } from "@nestjs/testing";
import { MusicResolver } from "@main/music/music.resolver";

describe("MusicResolver", () => {
    let resolver: MusicResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MusicResolver],
        }).compile();

        resolver = module.get<MusicResolver>(MusicResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
