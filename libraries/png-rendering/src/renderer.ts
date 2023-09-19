import { Types } from './index.js';
import GetResources from './resources/get-resources.js';

export function GetRenderer(config: Types.IPNGConfig) {
    GetResources(config.sprites, config.defaultFPS);
}

export default GetRenderer;