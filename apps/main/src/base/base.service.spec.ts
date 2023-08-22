import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { MusicService } from "@music/music.service";
import { Music } from "@music/models/Music.model";
import { BaseService } from "@base/base.service";

describe("BaseService", () => {
    let service: BaseService<any, any>;
    let repository: Record<string, jest.Mock>;

    beforeEach(async () => {
        repository = {
            clear: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [MusicService, { provide: getRepositoryToken(Music), useValue: repository }],
        }).compile();

        service = module.get<MusicService>(MusicService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to clear", async () => {
        await service.clear();

        expect(repository.clear).toHaveBeenCalled();
    });

    it("should be able to save singular item", async () => {
        await service.save({});

        expect(repository.save).toHaveBeenCalledWith({});
    });

    it("should be able to save multiple items", async () => {
        await service.save([{}]);

        expect(repository.save).toHaveBeenCalledWith([{}]);
    });
});
