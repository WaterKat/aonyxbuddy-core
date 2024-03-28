import { parseGIF, decompressFrames } from 'gifuct-js';

/**
 * Options for fetching an image bitmap
 */
interface IGetImageBitmapOptions {
    url: string
}

/**
 * Fetches an image bitmap from a given URL
 * @param options options for fetching an image bitmap, and any options for 
 * formatting 
 * @returns The image bitmap if successful, undefined otherwise
 */
export async function GetImageBitmap(
    options: IGetImageBitmapOptions
): Promise<ImageBitmap | undefined> {
    try {
        const image = await fetch(options.url);
        const blob = await image.blob();
        const bitmap = await createImageBitmap(blob);
        return bitmap;
    } catch (e) {
        return undefined;
    }
}

/**
 * GIF Bitmap and time delay bundle
 */
interface IGIFBitmapBundle {
    bitmap: ImageBitmap,
    delay: number
}

/**
 * Fetches a GIF from a given URL
 */
interface IGetGIFOptions {
    url: string
}

/**
 * Fetches a GIF from a given URL
 * @param options options for fetching a GIF
 * @returns The GIF if successful, undefined otherwise
 */
export async function GetGIF(
    options: IGetGIFOptions
): Promise<IGIFBitmapBundle[] | undefined> {
    try {
        const response = await fetch(options.url);
        const arrayBuffer = await response.arrayBuffer();
        const gif = parseGIF(arrayBuffer);
        const frames = decompressFrames(gif, true);

        const { width, height } = frames.map(frame => ({
            width: frame.dims.left + frame.dims.width,
            height: frame.dims.top + frame.dims.height
        })).reduce(({ width, height }, size) => ({
            width: Math.max(width, size.width),
            height: Math.max(height, size.height)
        }), { width: 0, height: 0 });

        const frameDelays = frames.map(frame => frame.delay);

        const imageDatas = frames.map(frame => {
            const patchLength = width * height * 4;
            const pixelData = new Uint8ClampedArray(patchLength);

            for (let i = 0; i < frame.pixels.length; i++) {
                const x = (i % frame.dims.width) + frame.dims.left;
                const y = Math.floor(i / frame.dims.width) + frame.dims.top;
                const index = (x + (y * width)) * 4;

                const colorIndex = frame.pixels[i];
                const color = frame.colorTable[colorIndex];
                if (frame.transparentIndex !== undefined
                    && colorIndex === frame.transparentIndex) {
                    pixelData.set([0, 0, 0, 0], index);
                } else {
                    pixelData.set([...color, 255], index);
                }
            }

            return new ImageData(pixelData, width, height);
        });

        const imageBitmaps = await Promise.all(
            imageDatas.map(imageData => createImageBitmap(imageData))
        );

        const bitmapBundle = imageBitmaps.map((bitmap, index) => ({
            bitmap,
            delay: frameDelays[index]
        }));

        return bitmapBundle;
    } catch (e) {
        return undefined;
    }
}
