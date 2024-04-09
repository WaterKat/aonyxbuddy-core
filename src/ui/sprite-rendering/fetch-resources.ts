import { parseGIF, decompressFrames } from 'gifuct-js';

/**
 * Bitmap and time delay bundle
 */
export interface IBitmapBundle {
    bitmap: ImageBitmap,
    delay: number
}

/** 
 * Parameters for fetching image bitmaps
*/
export interface IGetImageBitmapsParams {
    urls: string[],
    delay: number
}

/**
 * Fetches image bitmaps from a list of URLs / base64 strings, as a promise.
 * @param params the parameters for fetching the image bitmaps, and the delay
 * @returns the image bitmaps if successful, undefined otherwise 
 */
export async function GetImageBitmaps(
    params: IGetImageBitmapsParams
): Promise<IBitmapBundle[] | undefined> {
    try {
        const blobs = (await Promise.all(
            params.urls.map(url => GetBlob(url))
        )).filter(blob => blob !== undefined);

        if (blobs.length < 1) return undefined;

        const bitmaps = (await Promise.all(blobs.flatMap(async blob => {
            if (blob.type === "image/gif") {
                return GetGIFAsImageBitmaps(blob);
            } else if (blob.type === "image/png" ||
                blob.type === "image/jpeg") {
                return <IBitmapBundle>{
                    bitmap: await GetImageBitmap(blob),
                    delay: params.delay
                };
            } else {
                return undefined;
            }
        })))
        console.log("bitmaps: ", bitmaps);
        const filtered = bitmaps.filter(bitmap => bitmap !== undefined).flat();
        return filtered;
    } catch (e) {
        return undefined;
    }
}

/**
 * Fetches a GIF from a given URL as a promise
 * @param {string} url the gif's url
 * @returns {Promise<IBitmapBundle[] | undefined>} The GIF if successful,
 * undefined otherwise
 */
export async function GetGIFAsImageBitmaps(
    blob: Blob
): Promise<IBitmapBundle[] | undefined> {
    try {
        const response = new Response(blob);
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

        /** contain transparency, even gif compressions optimization */
        const partialPixelDatas = frames.map(frame => {
            const pixels: number[][][] = Array.from({ length: height },
                () => Array.from({ length: width }, () => [0, 0, 0, 0]));

            frame.pixels.forEach((pixel, index) => {
                const x = (frame.dims.left + (index % frame.dims.width));
                const y = (frame.dims.top + Math.floor(index / frame.dims.width));
                const color = frame.colorTable[pixel];
                if (frame.transparentIndex === undefined
                    || pixel !== frame.transparentIndex) {
                    pixels[y][x] = [...color, 255];
                }
            });

            return pixels;
        });

        /** accumulate changes */
        const pixels: number[][][] = Array.from({ length: height },
            () => Array.from({ length: width }, () => [0, 0, 0, 0]));

        const accumulatedPixelDatas = partialPixelDatas.map(partialPixels => {
            return partialPixels.map((row, y) => {
                return row.map((color, x) => {
                    if (color[3] === 0) {
                        return pixels[y][x];
                    } else {
                        pixels[y][x] = color;
                        return color;
                    }
                });
            });
        });

        /** */

        const intDatas = accumulatedPixelDatas.map(frame => {
            const pixelArray = frame.map(row => row.flat()).flat();
            const arr = new Uint8ClampedArray(width * height * 4);
            arr.set(pixelArray);
            return arr;
        });

        const imageDatas = intDatas.map(pixelData => {
            return new ImageData(
                pixelData,
                width,
                height
            );
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
        console.log("error caught: ", e);
        return undefined;
    }
}

/**
 * Fetches an image blob from a given URL and returns a promise
 * @param url the url for the image
 * @returns the image blob if successful, undefined otherwise
 */
export async function GetImageBlobFromURL(
    url: string
): Promise<Blob | undefined> {
    try {
        const response = await fetch(url);
        return await response.blob();
    } catch (e) {
        return undefined;
    }
}

/**
 * Creates an ImageBitmap if the provided string is a valid image format
 * @param {string} data string in base64 format containing image data
 * @returns {Promise<ImageBitmap | undefined>} the imageBitmap is successful
 * undefined if otherwise
 */
export async function GetImageBlobFromBase64(
    data: string
): Promise<Blob | undefined> {
    try {
        const dataType: string = data.substring(
            data.indexOf(':') + 1,
            data.indexOf(';')
        );
        const dataBase64: string = data.substring(
            data.indexOf(',') + 1
        );
        const byteChars: string = atob(dataBase64);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: dataType });
    } catch (e) {
        return undefined
    }
}

/**
 * Checks if string is in base64 image format
 * @param {string} data string in base64 format containing image data
 * @returns {boolean} wether string may be base64 image data
 */
export const IsBase64: (data: string) => boolean =
    (data: string) => data.startsWith("data:image");

/** The currently accpeted MIME data types */
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif"];

/**
 * Fetches a blob from a given string, either base64 or URL
 * @param data the string containing image data in either base64 or URL format
 * @returns the image blob if successful, undefined otherwise
 */
export async function GetBlob(data: string): Promise<Blob | undefined> {
    try {
        const blob = await (IsBase64(data)
            ? GetImageBlobFromBase64(data)
            : GetImageBlobFromURL(data));
        if (!blob || !ACCEPTED_IMAGE_TYPES.includes(blob.type)) {
            return undefined;
        }
        return blob;
    } catch (e) {
        return undefined;
    }
}

/**
 * Converts a blob to an image bitmap
 * @param {Blob} blob data of the image
 * @returns {Promise<ImageBitmap | undefined>} The image bitmap if successful,
 * undefined otherwise
 */
export async function GetImageBitmap(
    blob: Blob
): Promise<ImageBitmap | undefined> {
    try {
        const bitmap = await createImageBitmap(blob);
        return bitmap;
    } catch (e) {
        return undefined;
    }
}
