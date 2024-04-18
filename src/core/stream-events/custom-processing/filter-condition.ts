import { Logger } from "../logger-monad.js";

import {
    EStreamEventType,
    TStreamEvent
} from "../types.js";

/**
 * options for user with ProcessFilterCondition function. Contains the condition
 * to check for.
 */
export type FilterConditionOptions = {
    condition: boolean
}

/**
 * Takes in options and returns a function that processes an event by returning
 * the event if the condition is true, or an ignored event if the condition is
 * false.
 * @param options passed by reference, if the options object exists, the
 * condition is checked each time the inner function is called, if the options
 * object does not exist, the condition is always false. 
 * @returns a function that processes an event by returning the event if the
 * condition is true, or an ignored event if the condition is false.
 */
export function GetFilterConditionFunction(
    options?: FilterConditionOptions
): (event: TStreamEvent) => Logger<TStreamEvent> {
    if (!options) {
        return function (event: TStreamEvent) {
            return new Logger(<TStreamEvent>{
                tstype: event.tstype,
                type: EStreamEventType.IGNORE,
                username: event.username,
                reason: "condition"
            }, ["options were not defined"]);
        }
    }

    return function (event: TStreamEvent) {
        return new Logger(options?.condition ? event : <TStreamEvent>{
            tstype: event.tstype,
            type: EStreamEventType.IGNORE,
            username: event.username,
            reason: "condition"
        }, [`condition was ${options.condition}`])
    }
}