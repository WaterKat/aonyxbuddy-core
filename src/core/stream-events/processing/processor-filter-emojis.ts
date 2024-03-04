import { TEmote, TStreamEvent, EStreamEventType } from "../types";

/**
 * The regex to match standard emojis
 */
const EmojiRegex: RegExp = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g

/**
 * The options for the ProcessorFilterEmojis function
 */
export interface IProcessFilterEmojisOptions {
    replacement: string
}

/**
 * Filters out emojis from a chat message, and replaces them with a replacement
 * string. Returns the filtered stream event or the original event if it is not
 * a chat message.
 * @param event the stream event to process
 * @param options the options for processing the event
 * @returns the filtered stream event or the original event if it is not a chat
 * event
 */
export const ProcessorFilterEmojis = (
    event: TStreamEvent,
    options: IProcessFilterEmojisOptions
): TStreamEvent => (
    event.type === EStreamEventType.CHAT ? {
        tstype: event.tstype,
        type: event.type,
        username: event.username,
        nickname: event.nickname,
        message: {
            text: event.message.text.replace(EmojiRegex, options.replacement),
            emotes: event.message.emotes.map(
                (emote) => (<TEmote>{ type: emote.type, name: emote.name })
            )
        }
    } : event
);
