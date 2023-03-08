import sharp from "sharp";

interface ImageSize {
    width: number;
    height: number;
}

export function getImageSize(buffer: Buffer): Promise<ImageSize> {
    return sharp(buffer)
        .metadata()
        .then(metadata => {
            if (!metadata?.width || !metadata?.height) {
                throw new Error("Unable to get image size");
            }

            return {
                width: metadata.width,
                height: metadata.height,
            };
        });
}
