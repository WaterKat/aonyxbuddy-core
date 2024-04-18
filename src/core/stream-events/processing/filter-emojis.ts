import { Logger } from "../logger-monad.js";
import {
    TEmote, TStreamEvent, IsTMessageEvent, TMessageEvent
} from "../types.js";

/**
 * The regex to match standard emojis
 */
const EmojiRegex: RegExp = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;

/**
 * The options for the ProcessorFilterEmojis function
 */
export interface FilterEmojisOptions {
    filter: boolean,
    replacement: string
}

/**
 * Get a function that filters out emojis from a chat message, and replaces them
 * with a replacement string. Returns the filtered stream event or the original
 * event if it is not a chat message.
 * @param options the options for processing the event
 * @returns the function that processes the event
 */
export function GetFilterEmojisFunction(
    options?: FilterEmojisOptions
): (event: TStreamEvent) => Logger<TStreamEvent> {
    if (!options || !options.filter)
        return function (event: TStreamEvent): Logger<TStreamEvent> {
            return new Logger(
                event,
                ["options not defined or not set to filter emojis"]
            );
        }

    return function (event: TStreamEvent): Logger<TStreamEvent> {
        if (!IsTMessageEvent(event))
            return new Logger(event, ["event is not a message event"]);

        const copy = JSON.parse(JSON.stringify(event)) as TMessageEvent;

        const newMessageEvent = {
            ...copy,
            message: {
                text: event.message.text.replace(
                    EmojiRegex, options.replacement
                ),
                emotes: event.message.emotes.map(
                    (emote) => (<TEmote>{ type: emote.type, name: emote.name })
                )
            }
        }

        return new Logger(newMessageEvent, ["filtered emojis"]);
    }
}
