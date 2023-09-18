import GetGIFFromURL from "./get-gif-from-url.js";
import ParseBase64 from './get-image-from-base64.js';
import ParseImage from './get-image-from-url.js';
import { Types } from '../index.js';

async function ImageReferenceParser(reference: string | string[], defaultFPS): Promise<Types.ISpriteData | Error> {
    if (typeof reference === 'string') {
        return GetGIFFromURL(reference);
    }

    if (typeof reference === 'object' && Array.isArray(reference)) {
        if (reference.length < 1) {
            return new Error(`Invalid format: Provide at least one argument in the array`);
        }

        if (reference[0].startsWith('data:image')) {
            return ParseBase64(reference, defaultFPS);
        }

        if (reference[0].startsWith('http')) {
            return ParseImage(reference, defaultFPS);
        }

    }

    return new Error('Unknown Error');
}

export default ImageReferenceParser;