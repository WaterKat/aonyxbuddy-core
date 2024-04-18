import { Logger } from "../logger-monad.js";
import { TStreamEvent, IsTMessageEvent, TMessageEvent } from "../types.js";

/**
 * The regex to match any twitch cheermotes
 */
const CheermoteRegex: RegExp = /Cheer\d+/g;

/**
 * The options for the ProcessorFilterCheermotes function
 */
export interface FilterCheermotesOptions {
    filter: boolean,
    replacement: string
}

/**
 * Get a function that replaces any cheermotes in a message with the given
 * replacement string
 * @param options the options for the function
 * @returns a function that replaces cheermotes in a message with the given
 */
export function GetFilterCheermotesFunction(
    options?: FilterCheermotesOptions
): (event: TStreamEvent) => Logger<TStreamEvent> {
    if (!options || !options.filter)
        return function (event: TStreamEvent): Logger<TStreamEvent> {
            return new Logger(
                event, ["options not defined or filter is false"]
            );
        }

    return function (event: TStreamEvent): Logger<TStreamEvent> {
        if (!IsTMessageEvent(event))
            return new Logger(
                event, ["event is not a message event"]
            );

        const copy = JSON.parse(JSON.stringify(event)) as TMessageEvent;
        const newMessageEvent = {
            ...copy,
            message: {
                text: event.message.text.replace(
                    CheermoteRegex, options.replacement ?? ""
                ),
                emotes: event.message.emotes.map(
                    (emote) => ({ type: emote.type, name: emote.name })
                )
            }
        }

        return new Logger(newMessageEvent, ["Cheermotes filtered"]);
    }
};
