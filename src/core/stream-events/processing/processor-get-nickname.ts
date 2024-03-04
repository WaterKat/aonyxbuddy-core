import { TStreamEvent } from "../types.js";

/**
 * Options for processing a stream event with the ProcessNicknames function
 */
export interface IProcessNicknamesOptions {
    nicknameMap: { [key: string]: string[] },
    getNumBetween01Func: () => number
}

/**
 * Take in a stream event and options, and return the event with the nickname 
 * value assigned to a random nickname from the nicknameMap, or the username if
 * the username is not in the nicknameMap
 * @param event the event to process
 * @param options the options for processing the event
 * @returns the processed event
 */
export const ProcessNicknames =
    (event: TStreamEvent, options: IProcessNicknamesOptions) => {
        const deepCopy = JSON.parse(JSON.stringify(event)) as TStreamEvent;
        return ({
            ...deepCopy,
            nickname:
                options.nicknameMap[event.username] &&
                    options.nicknameMap[event.username].length > 0 ?
                    options.nicknameMap[event.username]
                    [Math.floor(
                        options.getNumBetween01Func() *
                        options.nicknameMap[event.username].length
                    )]
                    : event.username
        });
    }
