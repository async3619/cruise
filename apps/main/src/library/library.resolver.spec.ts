import { Test, TestingModule } from "@nestjs/testing";

import { LibraryResolver } from "@library/library.resolver";
import { LibraryScannerService } from "@library/library.scanner.service";

describe("LibraryResolver", () => {
    let resolver: LibraryResolver;
    let libraryScannerService: Record<string, jest.Mock>;

    beforeEach(async () => {
        libraryScannerService = {
            scanLibrary: jest.fn(),
            subscribeToLibraryScanningStateChanged: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [LibraryResolver, { provide: LibraryScannerService, useValue: libraryScannerService }],
        }).compile();

        resolver = module.get<LibraryResolver>(LibraryResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });

    it("should be able to scan library", async () => {
        await resolver.scanLibrary();

        expect(libraryScannerService.scanLibrary).toHaveBeenCalled();
    });

    it("should be able to subscribe to library scanning state changes", async () => {
        await resolver.libraryScanningStateChanged();

        expect(libraryScannerService.subscribeToLibraryScanningStateChanged).toHaveBeenCalled();
    });
});
