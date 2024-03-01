import { StreamEvent } from "../types.js";
import {
    FilterWordArrayFromChatMessageEventCaseSensitive,
    FilterWordArrayFromChatMessageEventCaseInsensitive
} from "./filter-banned-words.js";

/**
 * Options for processing a stream event
 */
export interface IProcessEventOptions {
    filterCaseSensitive?: string[],
    filterCaseInsensitive?: string[],
}

/**
 * Processes a stream event with the given options, and returns the processed 
 * event 
 * @param event event to apply processing to
 * @param options options for processing the event 
 * @returns the processed event
 */
export function ProcessEvent(
    event: StreamEvent,
    options: IProcessEventOptions
): StreamEvent {
    let workingEvent: StreamEvent = {
        ...event
    };
    if (options.filterCaseSensitive) {
        workingEvent = FilterWordArrayFromChatMessageEventCaseSensitive(
            workingEvent,
            options.filterCaseSensitive
        );
    }
    if (options.filterCaseInsensitive) {
        workingEvent = FilterWordArrayFromChatMessageEventCaseInsensitive(
            workingEvent,
            options.filterCaseInsensitive
        );
    }
    return workingEvent;
}
