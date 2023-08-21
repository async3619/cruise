import { Test, TestingModule } from "@nestjs/testing";
import { ConfigResolver } from "@config/config.resolver";
import { ConfigService } from "@config/config.service";
import { ColorMode } from "@config/models/config.dto";

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
        expect(service.getConfig).toBeCalledTimes(1);
    });

    it("should able to update config", async () => {
        const data = { colorMode: ColorMode.Light };
        service.setConfig.mockResolvedValueOnce(data);

        const config = await resolver.updateConfig(data);
        expect(config).toEqual(true);
        expect(service.setConfig).toBeCalledTimes(1);
    });
});
