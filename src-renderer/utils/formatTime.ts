export function formatSeconds(seconds: number) {
    seconds = Math.floor(seconds);

    let minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    const tokens: string[] = [secondsLeft.toString().padStart(2, "0")];

    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        minutes %= 60;
        tokens.unshift(minutes.toString().padStart(2, "0"));
        tokens.unshift(hours.toString().padStart(2, "0"));
    } else {
        tokens.unshift(minutes.toString());
    }

    return tokens.join(":");
}
