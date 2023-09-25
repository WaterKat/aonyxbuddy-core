import { Types } from "../index.js";

export function FilterBannedWords(streamEvent: Types.StreamEvent, bannedWords: string[], replacement?: string, caseSensitive?: boolean) : Types.StreamEvent {
    if (streamEvent.message){
        for (const bannedWord of bannedWords){
            if (caseSensitive) {
                streamEvent.message.text = streamEvent.message.text.replace(bannedWord, replacement ?? '');
            } else {
                const esc = bannedWord.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
                const reg = new RegExp(esc, 'ig');
                streamEvent.message.text = streamEvent.message.text.replace(reg, replacement ?? '') || '';
            }
        }
    }

    return streamEvent;
}