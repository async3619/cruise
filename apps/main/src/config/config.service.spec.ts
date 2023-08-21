import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService, DEFAULT_CONFIG } from "@config/config.service";
import { ColorMode } from "@config/models/config.dto";

describe("ConfigService", () => {
    let service: ConfigService;
    let fakeFs: Record<string, jest.Mock>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigService],
        }).compile();

        service = module.get<ConfigService>(ConfigService);

        fakeFs = {
            readFile: jest.fn(),
            writeFile: jest.fn(),
            ensureDir: jest.fn(),
        };

        Object.defineProperty(service, "fs", {
            get: () => fakeFs,
        });
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should return default config if config file does not exist", async () => {
        fakeFs.readFile.mockRejectedValueOnce(new Error("File not found"));
        const config = await service.getConfig(false);

        expect(config).toEqual(DEFAULT_CONFIG);
    });

    it("should return default config if config file is malformed", async () => {
        fakeFs.readFile.mockResolvedValueOnce("not json");
        const config = await service.getConfig(false);

        expect(config).toEqual(DEFAULT_CONFIG);
    });

    it("should return default config if config file is not valid config data", async () => {
        fakeFs.readFile.mockResolvedValueOnce('{"windowState": {"isMaximized": "yes"}}');
        const config = await service.getConfig(false);

        expect(config).toEqual(DEFAULT_CONFIG);
    });

    it("should return config if config file exists", async () => {
        const data = { colorMode: ColorMode.System };
        fakeFs.readFile.mockResolvedValueOnce(JSON.stringify(data));

        const config = await service.getConfig();
        expect(config).toEqual(data);
    });

    it("should write default config to file if reading config file fails", async () => {
        fakeFs.readFile.mockRejectedValueOnce(new Error("File not found"));

        await service.getConfig();

        expect(fakeFs.writeFile).toHaveBeenCalledWith(
            expect.stringContaining("config.json"),
            JSON.stringify(DEFAULT_CONFIG),
        );
    });

    it("should write config to file", async () => {
        const data = { colorMode: ColorMode.System };
        fakeFs.readFile.mockResolvedValueOnce(JSON.stringify(data));

        await service.setConfig({ colorMode: ColorMode.Light });

        expect(fakeFs.writeFile).toHaveBeenCalledWith(
            expect.stringContaining("config.json"),
            JSON.stringify({ colorMode: ColorMode.Light }),
        );
    });
});
