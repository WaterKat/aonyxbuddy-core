import { TEmote, TStreamEvent, EStreamEventType } from "../types.js";

/**
 * Options for the ProcessFilterWords function. Inlcudes the words to filter,
 * and the replacement string to use.
 */
export interface IProcessFilterWordsOptions {
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
 * Filters out an array of words from a chat message, and replaces them with a 
 * replacement string. CASE SENSITIVE
 * @param event the stream event to process 
 * @param wordsToFilter the array of words to filter out 
 * @param replacement the string to replace the filtered words with
 * @returns the filtered stream event 
 */
export const ProcessFilterWordsCaseSensitive = (
    event: TStreamEvent,
    options: IProcessFilterWordsOptions
) => (
    event.type === EStreamEventType.CHAT ? <TStreamEvent>{
        tstype: event.tstype,
        type: event.type,
        username: event.username,
        nickname: event.nickname,
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
    } : event
);

/**
 * Filters out an array of words from a chat message, and replaces them with a
 * replacement string. CASE INSENSITIVE
 * @param event the stream event to process
 * @param wordsToFilter the array of words to filter out
 * @param replacement the string to replace the filtered words with
 * @returns the filtered stream event
 */
export const ProcessFilterWordsCaseInsensitive = (
    event: TStreamEvent,
    options: IProcessFilterWordsOptions
) => (
    event.type === EStreamEventType.CHAT ? <TStreamEvent>{
        tstype: event.tstype,
        type: event.type,
        username: event.username,
        nickname: event.nickname,
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
    } : event 
);
