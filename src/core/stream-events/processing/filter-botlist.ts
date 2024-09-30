import { Logger } from "../logger-monad.js";
import { TStreamEvent, EStreamEventType } from "../types.js";

/**
 * The options for the FilterBotlist function
 * botlist: the list of usernames to ignore
 * allow: the list of event types to allow for bots
 */
export interface FilterBotlistOptions {
    botlist: string[],
    allow: EStreamEventType[]
}

/**
 * Returns a function that filters out events from a botlist if the event type
 * is not allowed
 * @param options the options for the function creation. If not defined or
 * empty, the function will return an event with a log message stating that
 * the options are not defined or empty
 * @returns a function that filters out events from a botlist if the event type
 * is not allowed
 */
export function GetFilterBotlistFunction(
    options?: FilterBotlistOptions
): (event: TStreamEvent) => Logger<TStreamEvent> {
    if (
        !options
        || !options.botlist || options.botlist.length === 0
        || !options.allow || options.allow.length === 0
    ) {
        return function (event: TStreamEvent): Logger<TStreamEvent> {
            return new Logger(event, ["options not defined or empty"]);
        }
    }

    return function (event: TStreamEvent): Logger<TStreamEvent> {
        const isBot = options.botlist.includes(event.username);
        const isBotAction = options.allow.includes(event.type);
        const log = [`is ${isBot ? "bot" : "not bot"}` +
            ` and is ${isBotAction ? "allowed" : "not allowed"}`]
        if (isBot && !isBotAction) {
            return new Logger({
                tstype: EStreamEventType.TS_TYPE,
                username: event.username,
                type: EStreamEventType.IGNORE,
                reason: "botlist",
                permissions: event.permissions
            }, log);
        } else {
            return new Logger(event, log);
        }
    }
}