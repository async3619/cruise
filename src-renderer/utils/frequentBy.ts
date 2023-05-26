export function frequentBy<T extends number | string>(items: T[], count: number) {
    // get the most n frequent items
    const map = new Map<T, number>();
    for (const item of items) {
        map.set(item, (map.get(item) || 0) + 1);
    }

    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    return sorted
        .slice(0, count)
        .map(([item]) => item)
        .filter((item): item is T => !!item);
}
