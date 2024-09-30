import { Logger } from "../logger-monad.js";
import { TStreamEvent, EStreamEventType } from "../types.js"

/**
 * The options for the GetFilterBlacklist function
 */
export interface FilterBlacklistOptions {
    blacklist: string[];
}

/**
 * Takes in options and returns a function that processes an event by returning
 * the event if the username is not in the blacklist, or an ignored event if
 * the username is in the blacklist.
 * @param options the options for the higher order function, which includes the
 * blacklist of usernames to ignore
 * @returns a function that processes an event by returning the event if the
 * username is not in the blacklist, or an ignored event if the username is in
 * the blacklist.
 */
export function GetFilterBlacklistFunction(
    options?: FilterBlacklistOptions
): (event: TStreamEvent) => Logger<TStreamEvent> {
    if (!options || !options.blacklist) {
        return function (event: TStreamEvent) {
            return new Logger(event, ['blacklist was not defined']);
        }
    }

    return function (event: TStreamEvent) {
        const shouldBlacklist = options.blacklist.includes(event.username);
        return new Logger(
            shouldBlacklist ? {
                tstype: event.tstype,
                type: EStreamEventType.IGNORE,
                username: event.username,
                permissions: event.permissions,
                reason: 'blacklist'
            } : event,
            [`blacklist was ${shouldBlacklist}`]
        );
    }
}
