import { TStreamEvent, EStreamEventType } from "../types.js";

/**
 * The options for the ProcessorIgnoreBotlist function
 * botlist: the list of usernames to ignore
 * allow: the list of event types to allow for bots
 */
export interface IProcessorFilterBotlistOptions {
    botlist: string[],
    allow: EStreamEventType[]
}

/**
 * Processes a stream event, ignoring events from a botlist, unless the event 
 * type is in the allow list
 * @param event The event to process
 * @param options The options for the processor, including the botlist and the 
 * allowed event types
 * @returns an ignored event if the event is from the botlist and not allowed
 * otherwise the original event
 */
export const ProcessorFilterBotlist = (
    event: TStreamEvent,
    options: IProcessorFilterBotlistOptions
) => (
    options.botlist.includes(event.username) && 
    !options.allow.includes(event.type) ? 
    <TStreamEvent>{
        tstype: EStreamEventType.TS_TYPE,
        username: event.username,
        type: EStreamEventType.IGNORE,
        reason: "botlist"
    } : event
);
