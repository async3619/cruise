import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@config/config.service";

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
        const config = await service.getConfig();

        expect(config).toEqual({});
    });

    it("should return default config if config file is malformed", async () => {
        fakeFs.readFile.mockResolvedValueOnce("not json");
        const config = await service.getConfig();

        expect(config).toEqual({});
    });

    it("should return default config if config file is not valid config data", async () => {
        fakeFs.readFile.mockResolvedValueOnce('{"windowState": {"isMaximized": "yes"}}');
        const config = await service.getConfig();

        expect(config).toEqual({});
    });

    it("should return config if config file exists", async () => {
        fakeFs.readFile.mockResolvedValueOnce(
            '{"windowState": {"isMaximized": true, "width": 100, "height": 100, "x": 100, "y": 100}}',
        );

        const config = await service.getConfig();
        expect(config).toEqual({
            windowState: {
                isMaximized: true,
                width: 100,
                height: 100,
                x: 100,
                y: 100,
            },
        });
    });

    it("should write config to file", async () => {
        fakeFs.readFile.mockResolvedValueOnce(
            '{"windowState": {"isMaximized": true, "width": 100, "height": 100, "x": 100, "y": 100}}',
        );

        await service.setConfig({ windowState: { isMaximized: false, width: 200, height: 200, x: 200, y: 200 } });

        expect(fakeFs.writeFile).toHaveBeenCalledWith(
            expect.stringContaining("config.json"),
            JSON.stringify({ windowState: { isMaximized: false, width: 200, height: 200, x: 200, y: 200 } }),
        );
    });
});
