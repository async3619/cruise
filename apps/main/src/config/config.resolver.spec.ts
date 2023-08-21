import { Test, TestingModule } from "@nestjs/testing";
import { ConfigResolver } from "@config/config.resolver";
import { ConfigService } from "@config/config.service";

describe("ConfigResolver", () => {
    let resolver: ConfigResolver;
    let service: Record<string, jest.Mock>;

    beforeEach(async () => {
        service = {
            getConfig: jest.fn(),
            setConfig: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigResolver, { provide: ConfigService, useValue: service }],
        }).compile();

        resolver = module.get<ConfigResolver>(ConfigResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });

    it("should able to get config", async () => {
        const data = { colorMode: "system" };
        service.getConfig.mockResolvedValueOnce(data);

        const config = await resolver.config();
        expect(config).toEqual(data);
    });
});
