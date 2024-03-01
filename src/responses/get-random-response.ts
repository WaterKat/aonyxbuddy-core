/**
 * A dictionary that contains response arrays for different keys
 */
export interface IResponseArray {
    [key: string]: string[]
}

/**
 * Get a random index from an array
 * @param array an array to get a random index from
 * @returns a random index from the array
 */
export function GetRandomIndex(array: Array<any>) {
    return Math.floor(Math.random() * array.length);
}

/**
 * Get a random response from a response array dictionary for a given key
 * @param responses a response array dictionary that contains desired responses 
 * for a given key
 * @param key the key to use to get a random response from the responses array 
 * usually a stream event type
 * @returns the random response from the responses array for the given key
 */
export function GetRandomResponse(
    responses: IResponseArray, key: string
): string {
    if (!responses[key]) return "";
    if (responses[key].length < 1) return "";
    return responses[key][GetRandomIndex(responses[key])];
}

