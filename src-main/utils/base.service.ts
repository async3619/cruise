import { In, Repository } from "typeorm";

export default class BaseService<T extends { id: string | number }> {
    protected constructor(private readonly repository: Repository<T>, private readonly name: string) {}

    private getRepository() {
        return this.repository as Repository<{ id: string | number }>;
    }

    public async getItemsByIds(ids: ReadonlyArray<T["id"]>) {
        const items = await this.getRepository().find({
            where: {
                id: In(ids),
            },
        });

        const result: T[] = [];
        for (const id of ids) {
            const item = items.find(item => item.id === id);
            if (!item) {
                throw new Error(`${this.name} with id '${id}' not found`);
            }

            result.push(item as T);
        }

        return result;
    }
}
