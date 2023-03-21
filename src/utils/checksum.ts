import * as blake2 from "blake2";

export default function checksum(buffer: Buffer): string {
    const hasher = blake2.createHash("blake2b");
    hasher.update(buffer);

    return hasher.digest("hex");
}
