export default function formatDuration(seconds: number, minimize?: boolean): string {
    if (isNaN(seconds)) {
        if (minimize) {
            return "0";
        }

        return "0:00:00";
    }

    seconds = Math.floor(seconds);

    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if (minimize) {
        const result: string[] = [minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")];
        if (hours > 0) {
            result.unshift(hours.toString());
        }

        if (result.length === 0) {
            return "0";
        }

        return result.join(":");
    }

    return [hours.toString(), minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");
}
