import { Types } from '../index.ts';
import { GetImage } from './get-image.ts';
import { GetGIFFromURL } from './get-gif-from-url.ts';

export async function GetResources(spriteReferences: Types.SpriteReferences, defaultFPS: number): Promise<Types.IAnimationData | Error> {
    const sprites: Types.IAnimationData = { idle: { delay: [], bitmap: [] }, talking: { delay: [], bitmap: [] } };

    const keys: string[] = Object.keys(spriteReferences);
    for (const key of keys) {
        if (typeof spriteReferences[key] === 'string') {
            const spriteData = await GetGIFFromURL(spriteReferences[key] as string);
            if (spriteData instanceof Error) return spriteData as Error;
            sprites[key] = spriteData;
        } else if (typeof spriteReferences[key] === 'object' && Array.isArray(spriteReferences[key])) {
            const spriteData = await GetImage(spriteReferences[key] as string[], defaultFPS);
            if (spriteData instanceof Error) return spriteData as Error;
            sprites[key] = spriteData;
        } else {
            return new Error(`Invalid format in key ${key}`);
        }
    }

    return sprites;
}
