export function loadImageAsBlob(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            const context = canvas.getContext("2d");
            if (!context) {
                reject(new Error("Cannot get context"));
                return;
            }

            context.drawImage(image, 0, 0);

            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error("Cannot get blob"));
                    return;
                }

                resolve(URL.createObjectURL(blob));
            });
        };

        image.src = src;
    });
}
