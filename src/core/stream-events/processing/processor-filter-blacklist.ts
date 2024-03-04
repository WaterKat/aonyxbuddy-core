import { TStreamEvent, EStreamEventType } from "../types.js"

/**
 * The options for the ProcessorFilterBlacklist function
 */
export interface IProcessFilterBlacklistOptions {
    blacklist: string[];
}

/**
 * Takes in an event and compares its username to the given blacklist. If the 
 * username is in the blacklist, the event is ignored.
 * @param event the event to process
 * @param options the options containint the blacklist
 * @returns the event, or an ignore event if the username is in the blacklist
 */
export const ProcessorFilterBlacklist = (
    event: TStreamEvent,
    options: IProcessFilterBlacklistOptions
): TStreamEvent => (
    options.blacklist.includes(event.username) ? <TStreamEvent>{
        tstype: event.tstype,
        type: EStreamEventType.IGNORE,
        username: event.username,
        reason: 'blacklist'
    } : event
);
