import { Logger } from "../logger-monad.js";
import {
    TEmote, TStreamEvent, IsTMessageEvent, TMessageEvent
} from "../types.js";

/**
 * Options for the ProcessFilterWords function. Inlcudes the words to filter,
 * and the replacement string to use.
 */
export interface FilterWordsOptions {
    wordsToFilter: string[];
    replacement: string;
}

/**
 * Filters out words from a string with text within an array of words, and 
 * replaces them with a replacement string. CASE SENSITIVE 
 * @param wordsToFilter an array of words to filter out
 * @param text the text to filter 
 * @param replacement the string to replace the banned words with 
 * @returns the filtered text 
 */
function FilterWordArrayCaseSensitive(
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
function FilterWordArrayCaseInsensitive(
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
 * Creates a function that filters out an array of words from a chat message,
 * and replaces them with a replacement string. CASE SENSITIVE
 * @param options the options for the function creation
 * @returns the function that filters out an array of words from a chat
 * message, and replaces them with a replacement string
 */
export function GetFilterCaseSensitiveFunction(
    options?: FilterWordsOptions
): (event: TStreamEvent) => Logger<TStreamEvent> {
    if (
        !options
        || !options.wordsToFilter || options.wordsToFilter.length === 0
    ) {
        return function (event: TStreamEvent): Logger<TStreamEvent> {
            return new Logger(event, ["options not defined"]);
        }
    }

    return function (event: TStreamEvent): Logger<TStreamEvent> {
        if (!IsTMessageEvent(event))
            return new Logger(event, ["Not a message event"]);

        const copy = JSON.parse(JSON.stringify(event)) as TMessageEvent;
        const newMessageEvent = {
            ...copy,
            message: {
                text: FilterWordArrayCaseSensitive(
                    options.wordsToFilter,
                    event.message.text,
                    options.replacement
                ),
                emotes: event.message.emotes.map(
                    (emote) => (<TEmote>{ type: emote.type, name: emote.name })
                )
            }
        }

        return new Logger(newMessageEvent, ["Filtered case sensitive"]);
    }
};

/**
 * Creates a function that filters out an array of words from a chat message,
 * and replaces them with a replacement string. CASE INSENSITIVE
 * @param options the options for the function creation
 * @returns the function that filters out an array of words from a chat
 * message, and replaces them with a replacement string
 */
export function GetFilterCaseInsensitiveFunction(
    options?: FilterWordsOptions
): (event: TStreamEvent) => Logger<TStreamEvent> {
    if (
        !options
        || !options.wordsToFilter || options.wordsToFilter.length === 0
    ) {
        return function (event: TStreamEvent): Logger<TStreamEvent> {
            return new Logger(event, ["options not defined"]);
        }
    }

    return function (event: TStreamEvent): Logger<TStreamEvent> {
        if (!IsTMessageEvent(event))
            return new Logger(event, ["Not a message event"]);

        const copy = JSON.parse(JSON.stringify(event)) as TMessageEvent;
        const newMessageEvent = {
            ...copy,
            message: {
                text: FilterWordArrayCaseInsensitive(
                    options.wordsToFilter,
                    event.message.text,
                    options.replacement
                ),
                emotes: event.message.emotes.map(
                    (emote) => (<TEmote>{ type: emote.type, name: emote.name })
                )
            }
        }

        return new Logger(newMessageEvent, ["Filtered case insensitive"]);
    }
}
