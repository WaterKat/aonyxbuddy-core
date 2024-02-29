export interface IResponseArray {
    [key: string]: string[]
}

export function GetRandomResponse(
    responses: IResponseArray, key: string
): string {
    if (!responses[key]) return "";
    if (responses[key].length < 1) return "";
    const randomResponseIndex =
        Math.floor(Math.random() * responses[key].length);
    const randomResponse = responses[key][randomResponseIndex];
    return randomResponse;
}

