import { ClearCanvas, DrawImageBitmap } from "./canvas.js";
import { GetImageBitmap } from "./fetch-resources.js";

/** mathematical clamp function */
const Clamp = (a: number, b: number, v: number) => Math.min(b, Math.max(a, v));
/** mathematical inverse lerp formula that finds the delta between a and b */
const InverseLerp = (a: number, b: number, v: number) => (v - a) / (b - a);

/**
 * The data required to render a sprite. The name is used to identify the
 * sprite, the paramInfo is used to determine the delta between the bitmaps
 * and the bitmaps are the images to render.
 */
export interface IRendererData {
    name: string,
    paramInfo: {
        min: number,
        max: number,
        default: number
    },
    urls?: string[],
    bitmaps: ImageBitmap[]
}

/**
 * The parameters used to render the sprite. The name is used to identify the
 * the sprite and the value is the parameter value.
 */
export interface IRendererParam {
    name: string,
    value: number
}

/**
 * The options for rendering the bitmaps. The context is the canvas rendering
 */
export interface IRenderOptions {
    ctx: CanvasRenderingContext2D,
    renderDatas: IRendererData[],
    params: IRendererParam[]
}

/**
 * Renders the bitmaps based on the parameters and the render data. The bitmaps
 * are drawn in the order they are provided in the render data.
 * @param options the options for rendering the bitmaps; the context, the
 * render data and the parameters
 */
export function RenderParams(options: IRenderOptions) {
    const renderBitmaps = options.renderDatas.map(renderInfo => {
        const inputParam = options.params.find(
            param => param.name === renderInfo.name
        );
        const delta = Clamp(renderInfo.paramInfo.min, renderInfo.paramInfo.max,
            InverseLerp(renderInfo.paramInfo.min, renderInfo.paramInfo.max,
                inputParam ? inputParam.value : renderInfo.paramInfo.default
            )
        );
        const index = Math.floor(renderInfo.bitmaps.length * delta)
        return {
            name: renderInfo.name,
            bitmap: renderInfo.bitmaps[
                index < renderInfo.bitmaps.length ?
                    index :
                    renderInfo.bitmaps.length - 1
            ]
        }
    });

    /** side effect: canvas is cleared then each bitmap is drawn */
    ClearCanvas({ ctx: options.ctx })
    renderBitmaps.forEach(renderBitmap => {
        DrawImageBitmap({ ctx: options.ctx, bitmap: renderBitmap.bitmap });
    });
}