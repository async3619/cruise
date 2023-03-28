import { Test, TestingModule } from "@nestjs/testing";

import { ConfigService } from "@main/config/config.service";

describe("ConfigService", () => {
    let service: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigService],
        }).compile();

        service = module.get<ConfigService>(ConfigService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
