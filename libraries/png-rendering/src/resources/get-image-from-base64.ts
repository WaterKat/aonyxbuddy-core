import { Types } from '../index.js';

const FPS : number = 60;

function BlobFromBase64(data: string): Blob | Error {
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

export async function ParseBase64(urls: string[], defaultFPS: number): Promise<Types.ISpriteData | Error> {
    const spriteData : Types.ISpriteData = {
        delay: new Array<number>(urls.length).fill(defaultFPS / FPS),
        bitmap: new Array<ImageBitmap>(urls.length)
    };
    const promises = [];
    for (let i = 0; i < urls.length){
        promises.push(async function() {
            
        });
    }
    return new Error();
}

export default ParseBase64;