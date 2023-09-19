import { Types } from '../index.js';

const FPS: number = 60;

export async function GetImage(uris: string[], defaultFPS: number): Promise<Types.ISpriteData | Error> {
    const spriteData: Types.ISpriteData = {
        delay: new Array<number>(uris.length).fill(defaultFPS / FPS),
        bitmap: new Array<ImageBitmap>(uris.length)
    };

    async function AssignBitmap(uri: string, index: number): Promise<void | Error> {
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
        try {
            spriteData.bitmap[index] = await createImageBitmap(blob);
        } catch (e) {
            return e as Error
        }
    }

    const promises: Promise<void | Error>[] = [];
    for (let i = 0; i < uris.length; i++) {
        promises.push(AssignBitmap(uris[i], i));
    }
    await Promise.all(promises);
    for (let i = 0; i < promises.length; i++) {
        if ((await promises[i]) instanceof Error) {
            return await promises[i] as Error;
        }
    }

    return spriteData;
}

export function GetBlobFromBase64(data: string): Blob | Error {
    try {
        const dataType: string = data.substring(
            data.indexOf(':') + 1,
            data.indexOf(';')
        );
        const dataBase64: string = data.substring(
            data.indexOf(',') + 1
        );
        const byteChars: string = atob(dataBase64);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: dataType });
    } catch (e) {
        return e as Error;
    }
}

export async function GetBlobFromURL(url: string): Promise<Blob | Error> {
    try {
        return (await fetch(url)).blob();
    } catch (e) {
        return e as Error;
    }
}