import { Test, TestingModule } from "@nestjs/testing";

import { MusicResolver } from "@music/music.resolver";
import { MusicService } from "@music/music.service";

describe("MusicResolver", () => {
    let resolver: MusicResolver;
    let musicService: Record<string, jest.Mock>;

    beforeEach(async () => {
        musicService = {
            findAll: jest.fn().mockImplementation(() => []),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [MusicResolver, { provide: MusicService, useValue: musicService }],
        }).compile();

        resolver = module.get<MusicResolver>(MusicResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });

    it("should be able to get all musics", async () => {
        await resolver.musics();

        expect(musicService.findAll).toHaveBeenCalled();
    });

    it("should be able to get related album", async () => {
        const music = { albumId: 1 };
        const loaders = { album: { load: jest.fn() } };

        await resolver.album(music as any, loaders as any);

        expect(loaders.album.load).toHaveBeenCalledWith(1);
    });

    it("should return null if albumId is not defined", async () => {
        const music = { albumId: null };
        const loaders = { album: { load: jest.fn() } };

        const result = await resolver.album(music as any, loaders as any);

        expect(result).toBeNull();
        expect(loaders.album.load).not.toHaveBeenCalled();
    });

    it("should be able to get related artists", async () => {
        const music = { artistIds: [100, 200] };
        const loaders = { artist: { load: jest.fn() } };

        await resolver.artists(music as any, loaders as any);

        expect(loaders.artist.load).toHaveBeenCalledWith(100);
        expect(loaders.artist.load).toHaveBeenCalledWith(200);
    });
});
