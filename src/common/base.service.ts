import _ from "lodash";
import { Class } from "utility-types";
import { BaseEntity, In, Repository } from "typeorm";
import type { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import type { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder";
import type { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

interface BaseEntityClass extends BaseEntity {
    id: number;
}

export class BaseService<T extends BaseEntityClass> {
    protected constructor(private readonly repository: Repository<T>, private readonly entityClass: Class<T>) {}

    public async findAll() {
        return this.repository.find();
    }
    public async findById(id: number, relations?: Array<Exclude<keyof T, number | symbol>>) {
        const item = await this.repository.findOne({
            where: {
                id,
            } as FindOptionsWhere<T>,
            relations,
        });

        if (item == null) {
            throw new Error(`'${this.entityClass.name}' with id ${id} not found`);
        }

        return item;
    }
    public async findByIds(ids: ReadonlyArray<number>) {
        const items = await this.repository.find({
            where: {
                id: In(ids),
            } as FindOptionsWhere<T>,
        });

        const itemMap = _.keyBy(items, "id");
        return ids.map(id => {
            const item = itemMap[id];
            if (item == null) {
                throw new Error(`'${this.entityClass.name}' with id ${id} not found`);
            }

            return item;
        });
    }

    public async count() {
        return this.repository.count();
    }
    public async getLastId() {
        const lastItem = await this.repository.find({
            order: {
                id: "DESC",
            } as FindOptionsOrder<T>,
        });

        return lastItem[0]?.id ?? 0;
    }

    public async bulkUpdate(ids: number[], data: QueryDeepPartialEntity<T>) {
        const items = await this.findByIds(ids);
        for (const item of items) {
            for (const [key, value] of Object.entries(data) as [keyof T, T[keyof T]][]) {
                item[key] = value;
            }
        }

        return this.repository.save(items);
    }
    public async update(id: number, data: QueryDeepPartialEntity<T>) {
        const item = await this.findById(id);
        if (!item) {
            throw new Error(`'${this.entityClass.name}' with id ${id} not found`);
        }

        for (const [key, value] of Object.entries(data) as [keyof T, T[keyof T]][]) {
            item[key] = value;
        }

        return this.repository.save(item);
    }

    public async clear() {
        return this.repository.clear();
    }
}
