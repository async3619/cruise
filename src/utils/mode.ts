export default function mode<T>(arr: T[]) {
    arr = [...arr];

    return arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop();
}
