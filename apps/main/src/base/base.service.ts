import { Repository, ObjectLiteral } from "typeorm";

export interface BaseEntity extends ObjectLiteral {
    id: number;
}

export abstract class BaseService<TEntity extends BaseEntity, TCreationArgs extends any[]> {
    protected constructor(private readonly entityRepository: Repository<TEntity>) {}

    public async clear() {
        await this.entityRepository.clear();
    }

    public abstract create(...args: TCreationArgs): TEntity;

    public async save(entity: TEntity): Promise<TEntity>;
    public async save(entities: TEntity[]): Promise<TEntity[]>;
    public async save(entityOrEntities: TEntity | TEntity[]): Promise<TEntity | TEntity[]> {
        if (Array.isArray(entityOrEntities)) {
            return this.entityRepository.save(entityOrEntities);
        }

        return this.entityRepository.save(entityOrEntities);
    }
}
