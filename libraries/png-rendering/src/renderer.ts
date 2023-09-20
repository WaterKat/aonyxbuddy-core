import { Types } from './index.js';
import * as resources  from './resources/index.js';
import * as canvas from './canvas/index.js';

export async function GetRenderer(config: Types.IPNGConfig) {
    const sprites = await resources.GetResources(config.sprites, config.defaultFPS);
    if (sprites instanceof Error) return sprites;
    const rendererCanvas = canvas.CreateCanvas(config.size.x,config.size.y);
    if (rendererCanvas instanceof Error) return rendererCanvas;
    return {
        canvas: rendererCanvas,
        sprites: sprites,
        renderSprite: (state: string, frame: number, callback?: () => void) => {
            canvas.DrawFrameOnCanvas(rendererCanvas, sprites, state, frame, callback);
        }
    }
}
