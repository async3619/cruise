import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { MusicService } from "@music/music.service";
import { Music } from "@music/models/music.model";

const MOCK_METADATA = {
    common: {
        title: "test",
        artist: "test",
        artists: ["test"],
        album: "test",
        albumartist: "test",
        genre: ["test"],
        year: 2021,
        track: { no: 1 },
        disk: { no: 1 },
    },
    format: { duration: 1 },
};

describe("MusicService", () => {
    let service: MusicService;
    let repository: Record<string, jest.Mock>;

    beforeEach(async () => {
        repository = {
            create: jest.fn().mockImplementation(p => p),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [MusicService, { provide: getRepositoryToken(Music), useValue: repository }],
        }).compile();

        service = module.get<MusicService>(MusicService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to create music object", () => {
        const filePath = "test";
        const music = service.create(MOCK_METADATA as any, filePath);

        expect(music.title).toBe(MOCK_METADATA.common.title);
        expect(music.artistName).toBe(MOCK_METADATA.common.artist);
        expect(music.artistNames).toBe(MOCK_METADATA.common.artists);
        expect(music.albumTitle).toBe(MOCK_METADATA.common.album);
        expect(music.albumArtist).toBe(MOCK_METADATA.common.albumartist);
        expect(music.genre).toBe(MOCK_METADATA.common.genre);
        expect(music.year).toBe(MOCK_METADATA.common.year);
        expect(music.trackNumber).toBe(MOCK_METADATA.common.track.no);
        expect(music.discNumber).toBe(MOCK_METADATA.common.disk.no);
        expect(music.duration).toBe(MOCK_METADATA.format.duration);
        expect(music.filePath).toBe(filePath);
        expect(repository.create).toHaveBeenCalled();
    });

    it("should be set artists to empty array if not present", () => {
        const filePath = "test";
        const music = service.create(
            { ...MOCK_METADATA, common: { ...MOCK_METADATA.common, artists: undefined } } as any,
            filePath,
        );

        expect(music.artistNames).toEqual([]);
    });

    it("should be set genre to empty array if not present", () => {
        const filePath = "test";
        const music = service.create(
            { ...MOCK_METADATA, common: { ...MOCK_METADATA.common, genre: undefined } } as any,
            filePath,
        );

        expect(music.genre).toEqual([]);
    });
});
