import _ from "lodash";
import { BaseEntity, In, Repository } from "typeorm";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { Class } from "utility-types";
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder";

interface BaseEntityClass extends BaseEntity {
    id: number;
}

export class BaseService<T extends BaseEntityClass> {
    protected constructor(private readonly repository: Repository<T>, private readonly entityClass: Class<T>) {}

    public async findAll() {
        return this.repository.find();
    }

    public async findById(id: number) {
        const item = await this.repository.findOne({
            where: {
                id,
            } as FindOptionsWhere<T>,
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

    public async getLastId() {
        const lastItem = await this.repository.find({
            order: {
                id: "DESC",
            } as FindOptionsOrder<T>,
        });

        return lastItem[0]?.id ?? 0;
    }
}
