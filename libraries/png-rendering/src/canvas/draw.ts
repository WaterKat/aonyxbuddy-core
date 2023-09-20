import { Types } from '../index.js';

const cache: { [key: string]: CanvasRenderingContext2D } = {};

export function DrawImageOnCanvas(canvas: HTMLCanvasElement, image: ImageBitmap, dx?: number, dy?: number, dw?: number, dh?: number) {
    if (!cache[canvas.id]) {
        cache[canvas.id] = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    if (dw && dh) {
        cache[canvas.id].drawImage(image, dx ?? 0, dy ?? 0, dw ?? canvas.width, dh ?? canvas.height);
    } else {
        cache[canvas.id].drawImage(image, dx ?? 0, dy ?? 0);
    }
}

export function DrawFrameOnCanvas(canvas: HTMLCanvasElement, sprites: Types.IAnimationData, key: string, frame: number, callback?: () => void) {
    if (!cache[canvas.id]) {
        cache[canvas.id] = canvas.getContext('2d') as CanvasRenderingContext2D;
    }
    const image = sprites[key].bitmap[frame];

    let sizeX = canvas.width;
    let sizeY = canvas.height;
    const canvasRatio = canvas.width / canvas.height;
    const imageRatio = image.width / image.height;

    if (canvasRatio > imageRatio) {
        //TODO
    }

    const ratio = image.width > image.height ? [1, image.height / image.width] : [image.width / image.height, 1];
    const canvasRatio = canvas.width / canvas.height;

    cache[canvas.id].drawImage(image, 0, 0, canvas.width * ratio, canvas.height / ratio);

    if (!callback) return;

    let sync = 0;
    requestAnimationFrame(() => {
        sync += 1;
        if (sync > 1)
            callback();
    });
    setTimeout(() => {
        sync += 1;
        if (sync > 1)
            callback();
    }, sprites[key].delay[frame]);
}