import { Test, TestingModule } from "@nestjs/testing";

import { ElectronResolver } from "@main/electron/electron.resolver";

describe("ElectronResolver", () => {
    let resolver: ElectronResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ElectronResolver],
        }).compile();

        resolver = module.get<ElectronResolver>(ElectronResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
