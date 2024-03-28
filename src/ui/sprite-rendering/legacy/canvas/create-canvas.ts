import { Types } from '../index.js';

export function CreateCanvas(config: Types.ICanvasConfig, parent?: HTMLElement): HTMLCanvasElement | Error {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = config.size.x;
        canvas.height = config.size.y;
        canvas.style.width = `${config.size.x}px`;
        canvas.style.height = `${config.size.y}px`;
        canvas.style.margin = `0 0`;
        canvas.style.padding = `0 0`;
        canvas.style.imageRendering = config.antialiasing ? 'smooth' : 'pixelated';
        parent ? parent.appendChild(canvas) : document.body.appendChild(canvas);
        return canvas;
    }
    catch (e) {
        return e as Error;
    }
}