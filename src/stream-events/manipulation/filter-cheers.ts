//import { Types } from "../index.js";
import { AonyxBuddyStreamEvent } from "@aonyxbuddy/stream-events";

const EmojiRegex : RegExp = /Cheer\d+/g;

export function FilterCheers(streamEvent: AonyxBuddyStreamEvent, replacement?: string) : AonyxBuddyStreamEvent {
    const modifiedEvent : AonyxBuddyStreamEvent = {
        ...streamEvent
    };

    if (modifiedEvent.message){
        modifiedEvent.message.text = modifiedEvent.message.text.replace(EmojiRegex, replacement ?? ' ');
    }

    return streamEvent;
}
