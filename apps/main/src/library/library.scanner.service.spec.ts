import path from "path";
import os from "os";

import { Test, TestingModule } from "@nestjs/testing";

import { LibraryScannerService } from "@library/library.scanner.service";
import { MusicService } from "@music/music.service";

describe("LibraryScannerService", () => {
    let service: LibraryScannerService;
    let musicService: Record<string, jest.Mock>;

    beforeEach(async () => {
        musicService = {
            clear: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [LibraryScannerService, { provide: MusicService, useValue: musicService }],
        }).compile();

        service = module.get<LibraryScannerService>(LibraryScannerService);

        Object.defineProperty(service, "pubSub", {
            value: {
                asyncIterator: jest.fn(),
                publish: jest.fn(),
            },
        });
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to scan local files", async () => {
        jest.spyOn(service, "getMediaFilePaths").mockResolvedValue(["./test.mp3"]);

        await service.scanLibrary();

        expect(musicService.clear).toHaveBeenCalled();
        expect(service.getMediaFilePaths).toHaveBeenCalled();
        expect(musicService.create).toHaveBeenCalled();
        expect(musicService.save).toHaveBeenCalled();
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
