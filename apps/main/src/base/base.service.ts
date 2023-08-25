import { PubSub } from "graphql-subscriptions";
import { ObjectLiteral, Repository } from "typeorm";

export interface BaseEntity extends ObjectLiteral {
    id: number;
}

export const ENTITY_CREATED = "ENTITY_CREATED";
export const ENTITY_UPDATED = "ENTITY_UPDATED";

export abstract class BaseService<TEntity extends BaseEntity, TCreationArgs extends any[]> {
    private readonly pubSub = new PubSub();

    protected constructor(private readonly entityRepository: Repository<TEntity>) {}

    public async clear() {
        await this.entityRepository.clear();
    }

    public abstract create(...args: TCreationArgs): TEntity;

    public async findAll(): Promise<TEntity[]> {
        return this.entityRepository.find();
    }

    public async save(entity: TEntity): Promise<TEntity>;
    public async save(entities: TEntity[]): Promise<TEntity[]>;
    public async save(entityOrEntities: TEntity | TEntity[]): Promise<TEntity | TEntity[]> {
        const entities = Array.isArray(entityOrEntities) ? entityOrEntities : [entityOrEntities];
        const createdEntities = entities.filter(entity => !entity.id);
        const updatedEntities = entities.filter(entity => entity.id);
        const result = await this.entityRepository.save(entities);

        if (createdEntities.length) {
            await this.pubSub.publish(ENTITY_CREATED, { [ENTITY_CREATED]: createdEntities });
        }

        if (updatedEntities.length) {
            await this.pubSub.publish(ENTITY_UPDATED, { [ENTITY_UPDATED]: updatedEntities });
        }

        return Array.isArray(entityOrEntities) ? result : result[0];
    }

    public asyncIterator(type: typeof ENTITY_CREATED | typeof ENTITY_UPDATED) {
        return this.pubSub.asyncIterator(type);
    }
}
