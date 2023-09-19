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

export async function GetBlobFromURL(url: string) : Promise<Blob | Error> {
    try {
        return (await fetch(url)).blob();
    } catch (e) {
        return e as Error;
    }
}