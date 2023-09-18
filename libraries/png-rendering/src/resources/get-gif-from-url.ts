import { parseGIF, decompressFrames } from 'gifuct-js';
import { Types } from '../index.js';

export async function GetGIFFromURL(url: string): Promise<Types.ISpriteData | Error> {
    const response = await fetch(url);
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

    return {
        delay: frames.map(frame => frame.delay),
        bitmap: imageBitmaps
    }
}

export default GetGIFFromURL;