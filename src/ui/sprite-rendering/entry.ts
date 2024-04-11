import {
    ConvertLegacyConfiguration, ILegacyConfig, IsLegacyConfig
} from "./legacy-support.js";
import { CreateCanvas, ICreateCanvasOptions } from "./canvas"
import {
    IRenderConfiguration, PopulateIRenderParams, RenderDefaults
} from "./renderer"

/**
 * The configuration for rendering the sprites. The canvas is the canvas
 * configuration, and the renderDatas are the images to render.
 * The params are the parameters to render the images.
 */
export type SpriteRenderingConfig = IRenderConfiguration & {
    canvas: ICreateCanvasOptions
};

/**
 * side effect: modifies the provided configuration, creates and appends a 
 * canvas to the document body, and renders the default sprites from the 
 * configuration if successful.
 * 
 * Initializes the renderer with the given configuration
 * @param rawConfig the configuration for rendering the sprites
 * @returns the canvas, the context, and the processed configuration if 
 * successful, undefined otherwise
 */
export async function InitializeRenderer(
    rawConfig: SpriteRenderingConfig | ILegacyConfig
) {
    try {
        const config = IsLegacyConfig(rawConfig) ?
            ConvertLegacyConfiguration(rawConfig) : rawConfig;

        const canvas = CreateCanvas(rawConfig.canvas);
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        document.body.appendChild(canvas);

        await PopulateIRenderParams(config);

        RenderDefaults(ctx, config);

        return {
            canvas,
            ctx,
            config
        }
    } catch (e) {
        console.warn(e);
        return undefined;
    }
}
