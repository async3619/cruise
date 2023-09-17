import { Test, TestingModule } from "@nestjs/testing";

import { ArtistResolver } from "@artist/artist.resolver";
import { ArtistService } from "@artist/artist.service";

import { Artist } from "@artist/models/artist.model";

describe("ArtistResolver", () => {
    let resolver: ArtistResolver;
    let service: Record<string, jest.Mock>;

    beforeEach(async () => {
        service = {
            findAll: jest.fn(),
            findById: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [ArtistResolver, { provide: ArtistService, useValue: service }],
        }).compile();

        resolver = module.get<ArtistResolver>(ArtistResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });

    it("should be able to get an artist by id", async () => {
        const artist = { id: 1 };
        service.findById.mockReturnValue(artist);

        const result = await resolver.artist(1);

        expect(result).toStrictEqual(artist);
    });

    it("should be able to get all artists", async () => {
        const artists = [{ id: 1 }, { id: 2 }];
        service.findAll.mockReturnValue(artists);

        const result = await resolver.artists();

        expect(result).toStrictEqual(artists);
    });

    it("should be able to get all musics of an artist", async () => {
        const artist = { id: 1, musicIds: [1, 2, 3] } as Artist;
        const musics = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const loaders = {
            music: { load: jest.fn().mockImplementation(id => musics.find(music => music.id === id)) },
        };

        const result = await resolver.musics(artist, loaders as any);

        expect(result).toStrictEqual(musics);
    });

    it("should be able to get all albums of an artist", async () => {
        const artist = { id: 1, albumIds: [1, 2, 3] } as Artist;
        const albums = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const loaders = {
            album: { load: jest.fn().mockImplementation(id => albums.find(album => album.id === id)) },
        };

        const result = await resolver.albums(artist, loaders as any);

        expect(result).toStrictEqual(albums);
    });
});
