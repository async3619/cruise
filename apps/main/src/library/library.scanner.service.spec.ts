import path from "path";
import os from "os";

import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { LibraryScannerService } from "@library/library.scanner.service";

import { MusicService } from "@music/music.service";
import { Music } from "@music/models/music.model";

import { AlbumService } from "@album/album.service";
import { Album } from "@album/models/album.model";

describe("LibraryScannerService", () => {
    let service: LibraryScannerService;
    let albumRepository: Record<string, jest.Mock>;
    let musicRepository: Record<string, jest.Mock>;

    beforeEach(async () => {
        albumRepository = {
            create: jest.fn().mockImplementation(p => ({ title: p, artists: [], albumArtists: [] })),
            save: jest.fn().mockImplementation(p => p),
            clear: jest.fn(),
        };
        musicRepository = {
            create: jest.fn().mockImplementation(p => p),
            save: jest.fn().mockImplementation(p => p),
            clear: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LibraryScannerService,
                AlbumService,
                MusicService,
                { provide: getRepositoryToken(Album), useValue: albumRepository },
                { provide: getRepositoryToken(Music), useValue: musicRepository },
            ],
        }).compile();

        service = module.get<LibraryScannerService>(LibraryScannerService);

        Object.defineProperty(service, "pubSub", {
            value: { asyncIterator: jest.fn(), publish: jest.fn() },
        });
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to scan local files", async () => {
        jest.spyOn(service, "getMediaFilePaths").mockResolvedValue(["./test.mp3"]);

        await service.scanLibrary();
        expect(service.getMediaFilePaths).toHaveBeenCalled();
    });

    it("should be able to get media file paths", async () => {
        const result = await service.getMediaFilePaths();

        expect(result).toEqual([path.join(os.homedir(), "./test.mp3")]);
    });

    it("should be able to subscribe to library scanning state changes", async () => {
        await service.subscribeToLibraryScanningStateChanged();
        expect(service["pubSub"].asyncIterator).toHaveBeenCalled();
    });
});
