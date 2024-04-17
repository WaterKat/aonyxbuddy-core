import { Logger } from "../logger-monad.js";
import { TStreamEvent } from "../types.js";

/**
 * Options for processing a stream event with the ProcessNicknames function
 */
export interface ValidateOptions {
    lowercase?: boolean,
}

/**
 * Take in a stream event and options, and return the event with the nickname 
 * value assigned to a random nickname from the nicknameMap, or the username if
 * the username is not in the nicknameMap
 * @param event the event to process
 * @param options the options for processing the event
 * @returns the processed event
 */
export function GetValidateFunction(
    options?: ValidateOptions
): (event: TStreamEvent) => Logger<TStreamEvent> {
    if (
        !options
        || !options.lowercase
    ) {
        return (event: TStreamEvent) => new Logger(
            event,
            ["options not defined or lowercase not set"]
        );
    }

    return function (event: TStreamEvent): Logger<TStreamEvent> {
        return new Logger({
            ...event,
            username: options.lowercase ?
                event.username.toLowerCase() : event.username,
        }, ["validated"]);
    }
}
