import {
    EStreamEventType,
    TStreamEvent
} from "../types.js";

/**
 * options for user with ProcessFilterCondition function. Contains the condition
 * to check for.
 */
export interface IProcessFilterConditionOptions {
    condition: boolean
}

/**
 * Takes in an event and options, and returns the event if the condition is
 * true, or an ignored event if the condition is false.
 * @param event the event to process
 * @param options the options for processing the event
 * @returns the event if the condition is true, or an ignored event if the 
 * condition is false
 */
export const ProcessFilterCondition = (
    event: TStreamEvent,
    options: IProcessFilterConditionOptions
) : TStreamEvent => (
    options.condition ? event : {
        tstype: event.tstype,
        type: EStreamEventType.IGNORE,
        username: event.username,
        reason: "condition"
    }
);

