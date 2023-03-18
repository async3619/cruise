import DataLoader from "dataloader";

export default async function loadMany<TKey, TItem>(
    dataLoader: DataLoader<TKey, TItem>,
    ids: TKey[],
): Promise<TItem[]> {
    const items = await dataLoader.loadMany(ids);
    const result: TItem[] = [];
    for (const item of items) {
        if (item instanceof Error) {
            throw item;
        }

        result.push(item);
    }

    return result;
}
