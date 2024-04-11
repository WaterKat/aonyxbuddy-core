/**
 * Options for the CreateCanvas function. Contains style options for the html 
 * element.
 */
export interface ICreateCanvasOptions {
    size: {
        x: number,
        y: number
    },
    antialiasing: boolean
}

/**
 * Creates a new canvas with that follows the provided options object. Returns
 * the created canvas 
 * @param options contains the style properties of the canvas to be created.
 * @returns the html canvas
 */
export function CreateCanvas(
    options: ICreateCanvasOptions
): HTMLCanvasElement {
    /** side effect: canvas dom element is added to document */
    const canvas = document.createElement('canvas');
    canvas.width = options.size.x;
    canvas.height = options.size.y;
    canvas.style.width = `${options.size.x}px`;
    canvas.style.height = `${options.size.y}px`;
    canvas.style.margin = `0 0`;
    canvas.style.padding = `0 0`;
    canvas.style.imageRendering =
        options.antialiasing ? 'smooth' : 'pixelated';
    return canvas;
}

/**
 * Options required for the rendering of images on a canvas context
 * contains dimensions and image data
 */
interface IDrawImageBitmapOptions {
    ctx: CanvasRenderingContext2D,
    bitmap: ImageBitmap,
    dimensions?: {
        sx?: number,
        sy?: number,
        sw?: number,
        sh?: number,
        dx?: number,
        dy?: number,
        dw?: number,
        dh?: number
    }
}

/**
 * Renders an image on the given context.
 * @param options contains, context, image, and dimension data
 */
export function DrawImageBitmap(options: IDrawImageBitmapOptions): void {
    const dimensions = options.dimensions ?? {};
    const sx: number = dimensions.sx ?? 0;
    const sy: number = dimensions.sy ?? 0;
    const sw: number = dimensions.sw
        ?? options.bitmap.width;
    const sh: number = dimensions.sh
        ?? options.bitmap.height;
    const dx: number = dimensions.dx ?? 0;
    const dy: number = dimensions.dy ?? 0;
    const dw: number = dimensions.dw
        ?? options.ctx.canvas.clientWidth;
    const dh: number = dimensions.dh
        ?? options.ctx.canvas.clientWidth;
    /** side effect: new bitmap is drawn on canvas */
    options.ctx.drawImage(options.bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
}

/**
 * Options used for the clear canvas function
 */
interface IClearCanvasOptions {
    ctx: CanvasRenderingContext2D,
    dimensions?: {
        x?: number,
        y?: number,
        w?: number,
        h?: number
    }
}

/**
 * @param options options used for the clear canvas options. includes dimensions
 * of portion to be cleared.
 */
export function ClearCanvas(options: IClearCanvasOptions): void {
    const dimensions = options.dimensions ?? {};
    const x: number = dimensions.x ?? 0;
    const y: number = dimensions.y ?? 0;
    const w: number = dimensions.w ?? options.ctx.canvas.clientWidth;
    const h: number = dimensions.h ?? options.ctx.canvas.clientHeight;
    /** side effect: canvas is cleared */
    options.ctx.clearRect(x, y, w, h);
}
