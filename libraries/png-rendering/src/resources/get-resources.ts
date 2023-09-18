import { Types } from '../index.ts';
import ImageReferenceParser from './image-parser.js';

async function GetResources(spriteReferences: Types.SpriteReferences, defaultFPS : number): Promise<Types.IAnimationData | Error> {
    const sprites: Types.IAnimationData = { idle: { delay: [], bitmap: [] }, talking: { delay: [], bitmap: [] } };

    const keys: string[] = Object.keys(spriteReferences);
    for (const key in keys) {
        const bitmaps = await ImageReferenceParser(spriteReferences[key], defaultFPS);

        if (bitmaps instanceof Error) {
            return bitmaps
        }

        sprites[key] = bitmaps;
    }

    return sprites;
}

export default GetResources;