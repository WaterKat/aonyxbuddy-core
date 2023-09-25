import { Types } from "../index.js";

const EmojiRegex : RegExp = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g

export function FilterEmojis(streamEvent: Types.StreamEvent, replacement?: string) : Types.StreamEvent {
    if (streamEvent.message){
        streamEvent.message.text = streamEvent.message.text.replace(EmojiRegex, replacement ?? '');
    }

    return streamEvent;
}
