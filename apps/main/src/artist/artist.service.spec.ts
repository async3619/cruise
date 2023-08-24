import { getRepositoryToken } from "@nestjs/typeorm";
import { Test, TestingModule } from "@nestjs/testing";

import { ArtistService } from "@artist/artist.service";

import { Artist } from "@artist/models/artist.model";

describe("ArtistService", () => {
    let service: ArtistService;
    let repository: Record<string, jest.Mock>;

    beforeEach(async () => {
        repository = {
            create: jest.fn().mockImplementation(p => p),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [ArtistService, { provide: getRepositoryToken(Artist), useValue: repository }],
        }).compile();

        service = module.get<ArtistService>(ArtistService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to create artist object", () => {
        const name = "test";
        const artist = service.create(name);

        expect(artist.name).toBe(name);
    });
});
