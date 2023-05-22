export function formatSeconds(seconds: number) {
    seconds = Math.floor(seconds);

    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
}
