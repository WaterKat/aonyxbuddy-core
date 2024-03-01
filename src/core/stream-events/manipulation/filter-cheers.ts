import { Types } from "../index.js";

const EmojiRegex : RegExp = /Cheer\d+/g;

export function FilterCheers(streamEvent: Types.StreamEvent, replacement?: string) : Types.StreamEvent {
    const modifiedEvent : Types.StreamEvent = {
        ...streamEvent
    };

    if (modifiedEvent.message){
        modifiedEvent.message.text = modifiedEvent.message.text.replace(EmojiRegex, replacement ?? ' ');
    }

    return streamEvent;
}
