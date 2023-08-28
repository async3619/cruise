import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { PlaylistService } from "@playlist/playlist.service";
import { Playlist } from "@playlist/models/playlist.model";
import { MusicService } from "@music/music.service";

describe("PlaylistService", () => {
    let service: PlaylistService;
    let repository: Record<string, jest.Mock>;
    let musicService: Record<string, jest.Mock>;

    beforeEach(async () => {
        repository = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        musicService = {
            findByIds: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlaylistService,
                { provide: getRepositoryToken(Playlist), useValue: repository },
                { provide: MusicService, useValue: musicService },
            ],
        }).compile();

        service = module.get<PlaylistService>(PlaylistService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to find all playlists", async () => {
        await service.findAll();
        expect(repository.find).toHaveBeenCalled();
    });

    it("should be able to create a playlist", async () => {
        await service.createFromMusicIds("name", [1, 2, 3]);

        expect(repository.findOne).toHaveBeenCalled();
        expect(repository.create).toHaveBeenCalled();
        expect(repository.save).toHaveBeenCalled();
    });

    it("should throw an error if a playlist with the same name already exists", async () => {
        repository.findOne.mockResolvedValueOnce({});

        await expect(service.createFromMusicIds("name", [1, 2, 3])).rejects.toThrowError();
    });
});
