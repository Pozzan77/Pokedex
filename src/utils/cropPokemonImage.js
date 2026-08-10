export function cropPokemonImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.crossOrigin = "anonymous";

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            const { data, width, height } = imageData;

            let minX = width;
            let minY = height;
            let maxX = 0;
            let maxY = 0;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const alpha = data[(y * width + x) * 4 + 3];

                    // Pixel isn't transparent
                    if (alpha > 10) {
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }

            const croppedWidth = maxX - minX + 1;
            const croppedHeight = maxY - minY + 1;

            const croppedCanvas = document.createElement("canvas");

            croppedCanvas.width = croppedWidth;
            croppedCanvas.height = croppedHeight;

            const croppedCtx = croppedCanvas.getContext("2d");

            croppedCtx.drawImage(
                img,
                minX,
                minY,
                croppedWidth,
                croppedHeight,
                0,
                0,
                croppedWidth,
                croppedHeight
            );

            resolve(croppedCanvas.toDataURL("image/png"));
        };

        img.onerror = reject;

        img.src = src;
    });
}