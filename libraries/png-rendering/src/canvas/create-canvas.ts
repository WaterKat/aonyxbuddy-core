export function CreateCanvas(width: number, height: number, parent?: HTMLElement): HTMLCanvasElement | Error {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.style.margin = `0 0`;
        canvas.style.padding = `0 0`;

        parent ? parent.appendChild(canvas) : document.body.appendChild(canvas);
        return canvas;
    }
    catch (e) {
        return e as Error;
    }
}