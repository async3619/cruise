import { Test, TestingModule } from "@nestjs/testing";

import { LibraryService } from "@library/library.service";
import { AlbumService } from "@album/album.service";
import { MusicService } from "@music/music.service";
import { ArtistService } from "@artist/artist.service";

describe("LibraryService", () => {
    let service: LibraryService;
    let musicService: Record<string, jest.Mock>;
    let albumService: Record<string, jest.Mock>;
    let artistService: Record<string, jest.Mock>;

    beforeEach(async () => {
        musicService = {
            findAll: jest.fn().mockResolvedValue([{ id: 0, title: "title" }]),
        };
        albumService = {
            findAll: jest.fn().mockResolvedValue([{ id: 0, title: "title" }]),
        };
        artistService = { findAll: jest.fn().mockResolvedValue([{ id: 0, name: "name" }]) };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LibraryService,
                { provide: MusicService, useValue: musicService },
                { provide: AlbumService, useValue: albumService },
                { provide: ArtistService, useValue: artistService },
            ],
        }).compile();

        service = module.get<LibraryService>(LibraryService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to get search suggestion items", async () => {
        await service.getSearchSuggestions();

        expect(musicService.findAll).toHaveBeenCalled();
        expect(albumService.findAll).toHaveBeenCalled();
        expect(artistService.findAll).toHaveBeenCalled();
    });
});
