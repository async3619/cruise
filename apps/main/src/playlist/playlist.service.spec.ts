import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { PlaylistEvents, PlaylistService } from "@playlist/playlist.service";
import { Playlist } from "@playlist/models/playlist.model";
import { MusicService } from "@music/music.service";

describe("PlaylistService", () => {
    let service: PlaylistService;
    let repository: Record<string, jest.Mock>;
    let musicService: Record<string, jest.Mock>;
    let pubSub: Record<string, jest.Mock>;

    beforeEach(async () => {
        repository = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        };

        musicService = {
            findByIds: jest.fn().mockImplementation(ids => ids.map(id => ({ id }))),
        };

        pubSub = {
            publish: jest.fn(),
            asyncIterator: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlaylistService,
                { provide: getRepositoryToken(Playlist), useValue: repository },
                { provide: MusicService, useValue: musicService },
            ],
        }).compile();

        service = module.get<PlaylistService>(PlaylistService);
        Object.defineProperty(service, "pubSub", { get: () => pubSub });
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to find a playlist with given id", async () => {
        await service.findById(1);
        expect(repository.findOne).toHaveBeenCalledWith({
            where: { id: 1 },
        });
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

    it("should publish a event when a playlist is created", async () => {
        await service.createFromMusicIds("name", [1, 2, 3]);
        expect(pubSub.publish).toHaveBeenCalled();
    });

    it("should be able to add musics to a playlist", async () => {
        repository.findOne.mockResolvedValueOnce({});

        await service.addMusicsToPlaylist(1, [1, 2, 3]);
        expect(musicService.findByIds).toHaveBeenCalled();
        expect(repository.findOne).toHaveBeenCalled();
        expect(repository.save).toHaveBeenCalled();
    });

    it("should throw an error if a playlist does not exist", async () => {
        repository.findOne.mockResolvedValueOnce(null);

        await expect(service.addMusicsToPlaylist(1, [1, 2, 3])).rejects.toThrowError();
    });

    it("should publish a event when a playlist is updated", async () => {
        repository.findOne.mockResolvedValueOnce({});

        await service.addMusicsToPlaylist(1, [1, 2, 3]);
        expect(pubSub.publish).toHaveBeenCalled();
    });

    it("should be able to delete a playlist", async () => {
        await service.delete(1);
        expect(repository.delete).toHaveBeenCalled();
    });

    it("should be able to delete items from a playlist", async () => {
        repository.findOne.mockResolvedValueOnce({
            musicIds: [1, 2, 3, 4],
        });

        await service.deleteItems(1, [1, 2, 3]);
        expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ musicIds: [1] }));
    });

    it("should throw an error if target deleting item playlist does not exist", async () => {
        repository.findOne.mockResolvedValueOnce(null);

        await expect(service.deleteItems(1, [1, 2, 3])).rejects.toThrowError();
    });

    it("should be able to clear a playlist", async () => {
        repository.findOne.mockResolvedValueOnce({});

        await service.clear(1);
        expect(repository.save).toHaveBeenCalled();
    });

    it("should throw an error if target clearing playlist does not exist", async () => {
        repository.findOne.mockResolvedValueOnce(null);

        await expect(service.clear(1)).rejects.toThrowError();
    });

    it("should be able to rename a playlist", async () => {
        repository.findOne.mockResolvedValueOnce({});

        await service.rename(1, "name");
        expect(repository.save).toHaveBeenCalled();
    });

    it("should throw an error if target renaming playlist does not exist", async () => {
        repository.findOne.mockResolvedValueOnce(null);

        await expect(service.rename(1, "name")).rejects.toThrowError();
    });

    it("should publish a event when a playlist is deleted", async () => {
        await service.delete(1);
        expect(pubSub.publish).toHaveBeenCalled();
    });

    it("should throw an error if a playlist with the same name already exists", async () => {
        repository.findOne.mockResolvedValueOnce({});

        await expect(service.createFromMusicIds("name", [1, 2, 3])).rejects.toThrowError();
    });

    it("should be able to subscribe to events", async () => {
        await service.asyncIterator(PlaylistEvents.CREATED);
        expect(pubSub.asyncIterator).toHaveBeenCalledWith(PlaylistEvents.CREATED);
    });
});
