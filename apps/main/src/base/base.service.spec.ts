import { In } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { BaseService, ENTITY_CREATED, ENTITY_UPDATED } from "@base/base.service";
import { MusicService } from "@music/music.service";

import { Music } from "@music/models/music.model";

describe("BaseService", () => {
    let service: BaseService<any, any>;
    let repository: Record<string, jest.Mock>;

    beforeEach(async () => {
        repository = {
            clear: jest.fn(),
            create: jest.fn(),
            save: jest.fn().mockImplementation(p => p),
            find: jest.fn(),
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

    it("should be able to find items by ids", async () => {
        repository.find.mockImplementation(() => [{ id: 1 }, { id: 2 }, { id: 3 }]);
        await service.findByIds([1, 2, 3]);

        expect(repository.find).toHaveBeenCalledWith({ where: { id: In([1, 2, 3]) } });
    });

    it("should throw error if item with given id is not found", async () => {
        repository.find.mockImplementation(() => [{ id: 1 }, { id: 2 }, { id: 3 }]);
        await expect(service.findByIds([1, 2, 3, 4])).rejects.toThrowError("Item with id `4` not found");
    });

    it("should be able to get all items", async () => {
        await service.findAll();

        expect(repository.find).toHaveBeenCalled();
    });

    it("should be able to save singular item", async () => {
        await service.save({});
        expect(repository.save).toHaveBeenCalledWith([{}]);
    });

    it("should be able to save multiple items", async () => {
        await service.save([{}]);
        expect(repository.save).toHaveBeenCalledWith([{}]);
    });

    it("should publish event after save", async () => {
        const publishSpy = jest.spyOn(service["pubSub"], "publish");

        await service.save({});
        await service.save([{}]);
        await service.save({ id: 1 });
        await service.save([{ id: 1 }]);

        expect(publishSpy).toHaveBeenNthCalledWith(1, ENTITY_CREATED, { [ENTITY_CREATED]: [{}] });
        expect(publishSpy).toHaveBeenNthCalledWith(2, ENTITY_CREATED, { [ENTITY_CREATED]: [{}] });
        expect(publishSpy).toHaveBeenNthCalledWith(3, ENTITY_UPDATED, { [ENTITY_UPDATED]: [{ id: 1 }] });
        expect(publishSpy).toHaveBeenNthCalledWith(4, ENTITY_UPDATED, { [ENTITY_UPDATED]: [{ id: 1 }] });
        expect(publishSpy).toHaveBeenCalledTimes(4);
    });

    it("should be able to subscribe to events", async () => {
        const asyncIteratorSpy = jest.spyOn(service["pubSub"], "asyncIterator");

        service.asyncIterator(ENTITY_CREATED);

        expect(asyncIteratorSpy).toHaveBeenCalledWith(ENTITY_CREATED);
    });
});
