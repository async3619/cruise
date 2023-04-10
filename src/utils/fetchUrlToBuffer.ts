import fetch from "node-fetch";

export async function fetchUrlToBuffer(url: string) {
    const response = await fetch(url);
    return response.buffer();
}
