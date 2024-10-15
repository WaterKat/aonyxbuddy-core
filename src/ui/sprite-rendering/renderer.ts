import { ClearCanvas, DrawImageBitmap } from "./canvas.js";
import { GetImageBitmaps, IBitmapBundle } from "./fetch-resources.js";

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
  name: string;
  paramInfo: {
    min: number;
    max: number;
    default: number;
  };
  delay: number;
  urls?: string[];
  bitmaps: IBitmapBundle[];
}

/**
 * The parameters used to render the sprite. The name is used to identify the
 * the sprite and the value is the parameter value.
 */
export interface IRendererParam {
  name: string;
  value: number;
}

/**
 * The options for rendering the bitmaps. The context is the canvas rendering
 */
export interface IRenderConfiguration {
  renderDatas: IRendererData[];
  params: IRendererParam[];
}

/**
 * side effect: changes the bitmap array value within each renderData object in
 * renderDatas.
 *
 * Uses the fetch resources packages to get bitmaps from the provided urls
 * or base64 strings. If the fetch function fails at any point, that renderData
 * will have an empty array as it bitmaps array
 * @param config the IRenderParams object that contains the field renderDatas
 * which is an array of IRendereData.
 */
export async function PopulateIRenderParams(config: IRenderConfiguration) {
  const bitmapDatas = await Promise.all(
    config.renderDatas.map((renderData) =>
      GetImageBitmaps({
        urls: renderData.urls ?? [],
        delay: renderData.delay,
      })
    )
  );
  /** side effect: edits bitmap values with new bitmaps*/
  config.renderDatas.forEach((renderData, index) => {
    renderData.bitmaps = bitmapDatas[index] ?? [];
  });
}

/**
 * side effect: changes the images being displayed on the provided canvas
 * context "ctx"
 *
 * Renders the bitmaps based on the parameters and the render data. The bitmaps
 * are drawn in the order they are provided in the render data.
 * @param renderParams the options for rendering the bitmaps; the context, the
 * render data and the parameters
 */
export function RenderParams(
  ctx: CanvasRenderingContext2D,
  renderParams: IRenderConfiguration
) {
  const renderBitmaps = renderParams.renderDatas.map((renderInfo) => {
    const inputParam = renderParams.params.find(
      (param) => param.name === renderInfo.name
    );
    const delta = Clamp(
      renderInfo.paramInfo.min,
      renderInfo.paramInfo.max,
      InverseLerp(
        renderInfo.paramInfo.min,
        renderInfo.paramInfo.max,
        inputParam ? inputParam.value : renderInfo.paramInfo.default
      )
    );
    const index = Math.floor(renderInfo.bitmaps.length * delta);
    return {
      name: renderInfo.name,
      bitmapBundle:
        renderInfo.bitmaps[
          index < renderInfo.bitmaps.length
            ? index
            : renderInfo.bitmaps.length - 1
        ],
    };
  });

  /** side effect: canvas is cleared then each bitmap is drawn */
  ClearCanvas(ctx);
  renderBitmaps.forEach((bitmapData) => {
    DrawImageBitmap({
      ctx: ctx,
      bitmap: bitmapData.bitmapBundle.bitmap,
    });
  });
}

/**
 * side effect: changes the images being displayed on the provided canvas
 * context "ctx"
 *
 * Renders the bitmaps based on the defaults of the render data provided.
 * This rendering function ignores the "params" array within the IRenderParams
 * provided.
 * @param renderParams the options for rendering the bitmaps; the context, the
 * render data and the parameters
 */
export function RenderDefaults(
  ctx: CanvasRenderingContext2D,
  renderParams: IRenderConfiguration
) {
  const defaultRenderParams: IRendererParam[] = renderParams.renderDatas.map(
    (renderData) => ({
      name: renderData.name,
      value: renderData.paramInfo.default,
    })
  );

  RenderParams(ctx, { ...renderParams, params: defaultRenderParams });
}
