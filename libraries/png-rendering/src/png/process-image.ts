import { parseGIF, decompressFrames } from 'gifuct-js'
import { PNGImageData } from './types.js';

export async function GetImageBitmap(_input: string | string[], _fps: number): Promise<PNGImageData[]> {
    let processedInput = _input;
    if (typeof _input === 'string' && !(processedInput as string).endsWith('.gif')){
        processedInput = [processedInput as string];
    }

    if (typeof processedInput === 'string') {
        return GetGifImageBitmap(processedInput);
    } else {
        return GetImageArrayBitmaps(processedInput, _fps);
    }
}

export async function GetGifImageBitmap(_url: string): Promise<PNGImageData[]> {
    const response = await fetch(_url);
    const arrayBuffer = await response.arrayBuffer();
    const gif = parseGIF(arrayBuffer);
    const frames = decompressFrames(gif, true);

    const { imageWidth, imageHeight } = (function(){
        let imageWidth = 0;
        let imageHeight = 0;
        frames.forEach(frame => {
            const frameWidth = frame.dims.width + frame.dims.left;
            const frameHeight = frame.dims.height + frame.dims.top;
            imageWidth = Math.max(imageWidth, frameWidth);
            imageHeight = Math.max(imageHeight, frameHeight);
          });
        return { imageWidth, imageHeight };
    })();

    frames.forEach(frame => { 
        const patchLength = imageWidth * imageHeight * 4;
        frame.patch = new Uint8ClampedArray(patchLength);

        for (let i = 0; i < frame.pixels.length; i++) {
            const localX = (i % frame.dims.width) ;
            const localY = ((i - localX) / frame.dims.width) + frame.dims.top;
            const imageX = localX + frame.dims.left;
            const imageY = localY + frame.dims.top;

            const setIndex = (imageX + (imageY * imageWidth)) * 4;

            const colorIndex = frame.pixels[i];
            const color = frame.colorTable[colorIndex];
            if (frame.transparentIndex !== undefined && colorIndex === frame.transparentIndex) {
                // Set to fully transparent
                frame.patch.set([0, 0, 0, 0], setIndex);
            } else {
                // Set to the color from the color table
                frame.patch.set([...color, 255], setIndex);
            }
        }
    });

    const imageDatas = frames.map(frame => {
        return new ImageData(
            new Uint8ClampedArray(
                frame.patch
            ),
            imageWidth,
            imageHeight
        );
    });

    const imageBitmaps = await Promise.all(imageDatas.map(imageData => createImageBitmap(imageData)));

    const PNGImageDatas: PNGImageData[] = [];
    for (let i = 0; i < imageBitmaps.length; i++) {
        PNGImageDatas.push({
            delay: frames[i].delay,
            bitmap: imageBitmaps[i]
        });
    }

    return PNGImageDatas;
}

export function GetImageArrayBitmaps(_urls: string[], _fps: number): Promise<PNGImageData[]> {
    return new Promise((resolve, reject) => {
        const imagePromises: Array<Promise<Response>> = [];
        for (const key in _urls) {
            imagePromises.push(fetch(_urls[key]));
        }
        Promise.all(imagePromises)
            .then(responses => {
                return Promise.all(responses.map(response => response.blob()));
            })
            .then(blobs => {
                return Promise.all(blobs.map(blob => createImageBitmap(blob)));
            })
            .then(imageBitmaps => {
                resolve(imageBitmaps.map(imageBitmap => {
                    return {
                        delay: 1000 / _fps,
                        bitmap: imageBitmap
                    }
                }));
            })
            .catch(error => { console.log('Image Array Error: ', error); reject(); });
    });
}
