import { Types } from '../index.js';
import { GetBlobFromBase64, GetBlobFromURL } from './get-blob.js';

const FPS: number = 60;

export async function ParseBase64(urls: string[], defaultFPS: number): Promise<Types.ISpriteData | Error> {

    const promises = [];
    for (let i = 0; i < urls.length) {
        promises.push(async function () {

        });
    }
    return new Error();
}

export default ParseBase64;

async function GetImage(uris: string[], defaultFPS: number): any | Error {
    const spriteData: Types.ISpriteData = {
        delay: new Array<number>(uris.length).fill(defaultFPS / FPS),
        bitmap: new Array<ImageBitmap>(uris.length)
    };

    async function AssignBitmap(uri: string, index: number) {
        let blob: Blob;
        if (uri.startsWith('data:image')) {
            const blobReq = GetBlobFromBase64(uri);
            if (blobReq instanceof Error) return blobReq;
            blob = blobReq;
        } else if (uri.startsWith('http')) {
            const blobReq = await GetBlobFromURL(uri);
            if (blobReq instanceof Error) return blobReq;
            blob = blobReq;
        } else {
            return new Error(`Invalid URI provided ${uri}`);
        }
        spriteData.bitmap[index] = await createImageBitmap(blob);
    }

    
    for (let i = 0; i < uris.length; i++) {

    }
}