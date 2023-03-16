export function reverseLerp(a: number, b: number, value: number) {
    return 1 - (value - a) / (b - a);
}

export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}
