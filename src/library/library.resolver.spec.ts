import { Test, TestingModule } from "@nestjs/testing";

import { LibraryResolver } from "@main/library/library.resolver";

describe("LibraryResolver", () => {
    let resolver: LibraryResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LibraryResolver],
        }).compile();

        resolver = module.get<LibraryResolver>(LibraryResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
