import { Types } from '../index.js';

const cache: { [key: string]: CanvasRenderingContext2D } = {};

export function DrawImageOnCanvas(canvas: HTMLCanvasElement, image: ImageBitmap, dx?: number, dy?: number) {
    if (!cache[canvas.id]) {
        cache[canvas.id] = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    cache[canvas.id].drawImage(image, dx ?? 0, dy ?? 0);
}

export function DrawFrameOnCanvas(canvas: HTMLCanvasElement, sprites: Types.IAnimationData, key: string, frame: number, callback?: () => {}) {
    if (!cache[canvas.id]) {
        cache[canvas.id] = canvas.getContext('2d') as CanvasRenderingContext2D;
    }
    const image = sprites[key].bitmap[frame];
    cache[canvas.id].drawImage(image, 0, 0);

    if (!callback) return;

    let tick = 0;
    requestAnimationFrame(() => {
        tick += 1;
        if (tick > 1)
            callback();
    });
    setTimeout(() => {
        tick += 1;
        if (tick > 1)
            callback();
    }, sprites[key].delay[frame]);
}