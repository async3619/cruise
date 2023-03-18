// get most common item in array
export default function common<T>(items: T[]): T | null {
    const counts = new Map<T, number>();
    for (const item of items) {
        const count = counts.get(item) ?? 0;
        counts.set(item, count + 1);
    }

    let maxCount = 0;
    let maxItem: T | undefined = undefined;
    for (const [item, count] of counts) {
        if (count > maxCount) {
            maxCount = count;
            maxItem = item;
        }
    }

    return maxItem || null;
}
