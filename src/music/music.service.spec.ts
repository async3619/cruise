import { Test, TestingModule } from "@nestjs/testing";
import { MusicService } from "@main/music/music.service";

describe("MusicService", () => {
    let service: MusicService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MusicService],
        }).compile();

        service = module.get<MusicService>(MusicService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
