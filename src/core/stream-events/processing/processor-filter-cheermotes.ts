import { TStreamEvent, EStreamEventType, IsTMessageEvent, TMessageEvent } from "../types.js";

/**
 * The regex to match any twitch cheermotes
 */
const EmojiRegex: RegExp = /Cheer\d+/g;

/**
 * The options for the ProcessorFilterCheermotes function
 */
export interface IProcessorFilterCheermotesOptions {
    replacement: string;
}

/**
 * Takes in a chat event and replaces any cheermotes with the given replacement
 * @param event the event to process
 * @param options the options containing the replacement
 * @returns the event with any cheermotes replaced
 */
export const ProcessorFilterCheermotes = (
    event: TStreamEvent,
    options: IProcessorFilterCheermotesOptions
): TStreamEvent => {
    if (!IsTMessageEvent(event)) return event;

    const copy = JSON.parse(JSON.stringify(event)) as TMessageEvent;
    const newMessageEvent = {
        ...copy,
        message: {
            text: event.message.text.replace(EmojiRegex, options.replacement),
            emotes: event.message.emotes.map(
                (emote) => ({ type: emote.type, name: emote.name })
            )
        }
    }

    return newMessageEvent;
};
