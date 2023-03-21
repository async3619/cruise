export default async function measure<T>(task: () => T | Promise<T>) {
    // measure time with high resolution
    const start = process.hrtime.bigint();
    const result = await task();
    const end = process.hrtime.bigint();

    // convert to milliseconds
    const duration = Number(end - start) / 1000000;

    return { result, duration };
}
