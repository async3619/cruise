import { Test, TestingModule } from "@nestjs/testing";
import { MusicResolver } from "./music.resolver";

describe("MusicResolver", () => {
    let resolver: MusicResolver;
    let musicService: Record<string, jest.Mock>;

    beforeEach(async () => {
        musicService = {
            findAll: jest.fn().mockImplementation(() => []),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [MusicResolver, { provide: "MusicService", useValue: musicService }],
        }).compile();

        resolver = module.get<MusicResolver>(MusicResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });

    it("should be able to get all musics", () => {
        expect(resolver.musics()).toEqual([]);
        expect(musicService.findAll).toHaveBeenCalled();
    });
});
