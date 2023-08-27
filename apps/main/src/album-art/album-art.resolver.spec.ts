import { Test, TestingModule } from "@nestjs/testing";

import { AlbumArtResolver } from "@album-art/album-art.resolver";
import { ElectronService } from "@electron/electron.service";

describe("AlbumArtResolver", () => {
    let resolver: AlbumArtResolver;
    let electronService: Record<string, jest.Mock>;

    beforeEach(async () => {
        electronService = { getElectronUrl: jest.fn().mockImplementation(p => p) };

        const module: TestingModule = await Test.createTestingModule({
            providers: [AlbumArtResolver, { provide: ElectronService, useValue: electronService }],
        }).compile();

        resolver = module.get<AlbumArtResolver>(AlbumArtResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });

    it("should be able to get url for album art in electron protocol format", async () => {
        electronService.getElectronUrl.mockReturnValue("electron://test");

        const result = await resolver.url(
            { imageId: "test" } as any,
            { image: { load: jest.fn().mockResolvedValue({ path: "test" }) } } as any,
        );

        expect(result).toEqual("electron://test");
        expect(electronService.getElectronUrl).toHaveBeenCalledWith("test");
    });
});
