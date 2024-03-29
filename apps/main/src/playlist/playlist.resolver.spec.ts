import { Test, TestingModule } from "@nestjs/testing";
import { PlaylistResolver } from "@playlist/playlist.resolver";
import { PlaylistEvents, PlaylistService } from "@playlist/playlist.service";

describe("PlaylistResolver", () => {
    let resolver: PlaylistResolver;
    let service: Record<string, jest.Mock>;

    beforeEach(async () => {
        service = {
            findById: jest.fn(),
            findAll: jest.fn(),
            createFromMusicIds: jest.fn(),
            addMusicsToPlaylist: jest.fn(),
            asyncIterator: jest.fn(),
            delete: jest.fn(),
            clear: jest.fn(),
            rename: jest.fn(),
            deleteItems: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [PlaylistResolver, { provide: PlaylistService, useValue: service }],
        }).compile();

        resolver = module.get<PlaylistResolver>(PlaylistResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });

    it("should be able to find a playlist with given id", async () => {
        await resolver.playlist(1);
        expect(service.findById).toHaveBeenCalled();
    });

    it("should be able to find all playlists", async () => {
        await resolver.playlists();
        expect(service.findAll).toHaveBeenCalled();
    });

    it("should be able to create a playlist", async () => {
        await resolver.createPlaylist("name", [1, 2, 3]);
        expect(service.createFromMusicIds).toHaveBeenCalled();
    });

    it("should be able to add musics to a playlist", async () => {
        await resolver.addMusicsToPlaylist(1, [1, 2, 3]);
        expect(service.addMusicsToPlaylist).toHaveBeenCalled();
    });

    it("should be able to clear a playlist", async () => {
        await resolver.clearPlaylist(1);
        expect(service.clear).toHaveBeenCalled();
    });

    it("should be able to rename a playlist", async () => {
        await resolver.renamePlaylist(1, "name");
        expect(service.rename).toHaveBeenCalled();
    });

    it("should be able to delete a playlist", async () => {
        await resolver.deletePlaylist(1);
        expect(service.delete).toHaveBeenCalled();
    });

    it("should be able to delete items from a playlist", async () => {
        await resolver.deletePlaylistItems(1, [1, 2, 3]);
        expect(service.deleteItems).toHaveBeenCalledWith(1, [1, 2, 3]);
    });

    it("should be able to resolve musics", async () => {
        const musicLoader = { load: jest.fn() };
        await resolver.musics({ musicIds: [1, 2, 3] } as any, { music: musicLoader } as any);

        expect(musicLoader.load).toHaveBeenCalledTimes(3);
    });

    it("should be able to subscribe to playlistCreated event", async () => {
        await resolver.playlistCreated();
        expect(service.asyncIterator).toHaveBeenCalledWith(PlaylistEvents.CREATED);
    });

    it("should be able to subscribe to playlistDeleted event", async () => {
        await resolver.playlistDeleted();
        expect(service.asyncIterator).toHaveBeenCalledWith(PlaylistEvents.DELETED);
    });

    it("should be able to subscribe to playlistUpdated event", async () => {
        await resolver.playlistUpdated();
        expect(service.asyncIterator).toHaveBeenCalledWith(PlaylistEvents.UPDATED);
    });
});
