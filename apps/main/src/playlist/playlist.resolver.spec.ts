import { Test, TestingModule } from "@nestjs/testing";
import { PlaylistResolver } from "@playlist/playlist.resolver";
import { PlaylistService } from "@playlist/playlist.service";

describe("PlaylistResolver", () => {
    let resolver: PlaylistResolver;
    let service: Record<string, jest.Mock>;

    beforeEach(async () => {
        service = {
            findAll: jest.fn(),
            createFromMusicIds: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [PlaylistResolver, { provide: PlaylistService, useValue: service }],
        }).compile();

        resolver = module.get<PlaylistResolver>(PlaylistResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });

    it("should be able to find all playlists", async () => {
        await resolver.playlists();
        expect(service.findAll).toHaveBeenCalled();
    });

    it("should be able to create a playlist", async () => {
        await resolver.createPlaylist("name", [1, 2, 3]);
        expect(service.createFromMusicIds).toHaveBeenCalled();
    });

    it("should be able to resolve musics", async () => {
        const musicLoader = { load: jest.fn() };
        await resolver.musics({ musicIds: [1, 2, 3] } as any, { music: musicLoader } as any);

        expect(musicLoader.load).toHaveBeenCalledTimes(3);
    });
});
