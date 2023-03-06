export default function formatDuration(seconds: number): string {
    seconds = Math.floor(seconds);

    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    return [hours.toString(), minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");
}
