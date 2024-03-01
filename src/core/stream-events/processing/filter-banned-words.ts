import { StreamEvent, StreamEventType } from "../types.js";

/**
 * Filters out words from a string with text within an array of words, and 
 * replaces them with a replacement string. CASE SENSITIVE 
 * @param wordsToFilter an array of words to filter out
 * @param text the text to filter 
 * @param replacement the string to replace the banned words with 
 * @returns the filtered text 
 */
export function FilterWordArrayCaseSensitive(
    wordsToFilter: Array<string>,
    text: string,
    replacement: string
): string {
    let workingText = text;
    for (let i = 0; i < wordsToFilter.length; i++) {
        workingText = text.replace(wordsToFilter[i], replacement);
    }
    return workingText;
}

/**
 * Filters out words from a string with text within an array of words, and
 * replaces them with a replacement string. CASE INSENSITIVE
 * @param wordsToFilter an array of words to filter out
 * @param text the text to filter
 * @param replacement the string to replace the banned words with
 * @returns the filtered text
 */
export function FilterWordArrayCaseInsensitive(
    wordsToFilter: Array<string>,
    text: string,
    replacement: string
): string {
    let workingText = text;
    for (let i = 0; i < wordsToFilter.length; i++) {
        workingText = workingText.replace(
            new RegExp(
                wordsToFilter[i].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
                'ig'
            ),
            replacement
        );
    }
    return workingText;
}

/**
 * Filters out an array of words from a chat message, and replaces them with a 
 * replacement string. CASE SENSITIVE
 * @param event the stream event to process 
 * @param wordsToFilter the array of words to filter out 
 * @param replacement the string to replace the filtered words with
 * @returns the filtered stream event 
 */
export function FilterWordArrayFromChatMessageEventCaseSensitive(
    event: StreamEvent,
    wordsToFilter: string[],
    replacement: string = ''
): StreamEvent {
    if (event.type !== StreamEventType.CHAT) {
        return {
            ...event
        }
    } else {
        return {
            ...event,
            message: {
                ...event.message,
                text: FilterWordArrayCaseSensitive(
                    wordsToFilter,
                    event.message.text,
                    replacement
                )
            }
        }
    }
}

/**
 * Filters out an array of words from a chat message, and replaces them with a
 * replacement string. CASE INSENSITIVE
 * @param event the stream event to process
 * @param wordsToFilter the array of words to filter out
 * @param replacement the string to replace the filtered words with
 * @returns the filtered stream event
 */
export function FilterWordArrayFromChatMessageEventCaseInsensitive(
    event: StreamEvent,
    wordsToFilter: string[],
    replacement: string = ''
): StreamEvent {
    if (event.type !== StreamEventType.CHAT) {
        return {
            ...event
        }
    } else {
        return {
            ...event,
            message: {
                ...event.message,
                text: FilterWordArrayCaseSensitive(
                    wordsToFilter,
                    event.message.text,
                    replacement
                )
            }
        }
    }
}
