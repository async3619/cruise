import path from "path";
import os from "os";

import { Test, TestingModule } from "@nestjs/testing";

import { LibraryScannerService } from "@library/library.scanner.service";

import { MusicService } from "@music/music.service";
import { AlbumService } from "@album/album.service";
import { ArtistService } from "@artist/artist.service";
import { AlbumArtService } from "@album-art/album-art.service";
import { ImageService } from "@image/image.service";

function mockBaseService(create = jest.fn().mockImplementation(p => p), save = jest.fn().mockImplementation(p => p)) {
    return {
        create,
        save,
        clear: jest.fn(),
    };
}

describe("LibraryScannerService", () => {
    let service: LibraryScannerService;
    let albumService: Record<string, jest.Mock>;
    let musicService: Record<string, jest.Mock>;
    let albumArtService: Record<string, jest.Mock>;
    let artistService: Record<string, jest.Mock>;
    let imageService: Record<string, jest.Mock>;

    beforeEach(async () => {
        albumService = mockBaseService(jest.fn().mockImplementation(name => ({ title: name })));
        musicService = mockBaseService();
        albumArtService = mockBaseService();
        artistService = mockBaseService();
        imageService = { ensure: jest.fn().mockImplementation(p => p) };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LibraryScannerService,
                { provide: AlbumService, useValue: albumService },
                { provide: MusicService, useValue: musicService },
                { provide: AlbumArtService, useValue: albumArtService },
                { provide: ArtistService, useValue: artistService },
                { provide: ImageService, useValue: imageService },
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

    it("should create album art and image entity if there was album art in audio file metadata", async () => {
        const RAW_PICTURE = { data: "data" };
        await service.scanLibrary();

        expect(imageService.ensure).toHaveBeenCalledWith(RAW_PICTURE, "album-arts");
        expect(albumArtService.create).toHaveBeenCalledWith(RAW_PICTURE, RAW_PICTURE);
    });

    it("should create artist entity if there was artist name in audio file metadata", async () => {
        const ARTIST_NAME = "test";

        jest.spyOn(service, "getMediaFilePaths").mockResolvedValue(["./test.mp3"]);
        musicService.create.mockReturnValue({ artistNames: [ARTIST_NAME] });

        await service.scanLibrary();

        expect(artistService.create).toHaveBeenCalledWith(ARTIST_NAME);
    });

    it("should create album entity if there was album title in audio file metadata", async () => {
        const ALBUM_TITLE = "test";

        jest.spyOn(service, "getMediaFilePaths").mockResolvedValue(["./test.mp3"]);
        musicService.create.mockReturnValue({ albumTitle: ALBUM_TITLE });

        await service.scanLibrary();

        expect(albumService.create).toHaveBeenCalledWith(ALBUM_TITLE);
        expect(albumService.save).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                title: ALBUM_TITLE,
            }),
        );
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
