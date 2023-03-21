import { filesize } from "filesize";

export default function formatFileSize(size: number): string {
    const data = filesize(size, { round: 0, output: "string", standard: "jedec" });
    if (typeof data !== "string") {
        throw new Error("parsed data is not a string");
    }

    return data;
}
