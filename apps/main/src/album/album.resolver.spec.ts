import { Test, TestingModule } from "@nestjs/testing";
import { AlbumResolver } from "@album/album.resolver";
import { AlbumService } from "@album/album.service";
import { Album } from "@album/models/album.model";

describe("AlbumResolver", () => {
    let resolver: AlbumResolver;
    let service: Record<string, jest.Mock>;

    beforeEach(async () => {
        service = {
            findAll: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [AlbumResolver, { provide: AlbumService, useValue: service }],
        }).compile();

        resolver = module.get<AlbumResolver>(AlbumResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });

    it("should be able to get all albums", async () => {
        const albums = [{ id: 1 }, { id: 2 }];
        service.findAll.mockReturnValue(albums);

        const result = await resolver.albums();

        expect(result).toStrictEqual(albums);
    });

    it("should be able to get all musics of an album", async () => {
        const album = { id: 1, musicIds: [1, 2, 3] } as Album;
        const musics = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const loaders = {
            music: { load: jest.fn().mockImplementation(id => musics.find(music => music.id === id)) },
        };

        const result = await resolver.musics(album, loaders as any);

        expect(result).toStrictEqual(musics);
    });

    it("should be able to get all artists of an album", async () => {
        const album = { id: 1, artistIds: [1, 2, 3] } as Album;
        const artists = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const loaders = {
            artist: { load: jest.fn().mockImplementation(id => artists.find(artist => artist.id === id)) },
        };

        const result = await resolver.artists(album, loaders as any);

        expect(result).toStrictEqual(artists);
    });

    it("should be able to get primary album art of an album", async () => {
        const album = { id: 1, albumArtIds: [1] } as Album;
        const albumArt = { id: 1 };
        const loaders = {
            primaryAlbumArt: { load: jest.fn().mockReturnValue(albumArt) },
        };

        const result = await resolver.albumArt(album, loaders as any);

        expect(result).toStrictEqual(albumArt);
    });

    it("should be able to get all album arts of an album", async () => {
        const album = { id: 1, albumArtIds: [1, 2, 3] } as Album;
        const albumArts = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const loaders = {
            albumArt: { load: jest.fn().mockImplementation(id => albumArts.find(albumArt => albumArt.id === id)) },
        };

        const result = await resolver.albumArts(album, loaders as any);

        expect(result).toStrictEqual(albumArts);
    });
});
