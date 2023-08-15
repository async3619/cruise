import { Test, TestingModule } from "@nestjs/testing";

import { ElectronService } from "@electron/electron.service";

describe("ElectronService", () => {
    let service: ElectronService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ElectronService],
        }).compile();

        service = module.get<ElectronService>(ElectronService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
