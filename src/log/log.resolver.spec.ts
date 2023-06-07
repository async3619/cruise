import { Test, TestingModule } from "@nestjs/testing";
import { LogResolver } from "./log.resolver";

describe("LogResolver", () => {
    let resolver: LogResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LogResolver],
        }).compile();

        resolver = module.get<LogResolver>(LogResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
