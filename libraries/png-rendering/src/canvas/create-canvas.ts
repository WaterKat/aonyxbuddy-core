export function CreateCanvas(width: number, height: number, parent?: HTMLElement): HTMLCanvasElement | Error {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        parent ? parent.appendChild(canvas) : document.body.appendChild(canvas);
        return canvas;
    }
    catch (e) {
        return e as Error;
    }
}