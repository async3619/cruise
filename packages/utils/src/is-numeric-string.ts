export function isNumericString(value: string): boolean {
    return !isNaN(Number(value));
}
