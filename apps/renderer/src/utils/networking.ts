export async function downloadBlob(url: string) {
    // use HTML5 fetch API
    const response = await fetch(url);

    return response.blob();
}
