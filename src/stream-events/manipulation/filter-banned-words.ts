import { Types } from "../index.js";

export function FilterBannedWords(streamEvent: Types.StreamEvent, bannedWords: string[], replacement: string = '', caseSensitive: boolean = false): Types.StreamEvent {
    const modifiedEvent: Types.StreamEvent = {
        ...streamEvent
    }
    if (modifiedEvent.message) {
        for (const bannedWord of bannedWords) {
            if (caseSensitive) {
                modifiedEvent.message.text = modifiedEvent.message.text.replace(bannedWord, replacement ?? '');
            } else {
                const esc = bannedWord.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
                const reg = new RegExp(esc, 'ig');
                modifiedEvent.message.text = modifiedEvent.message.text.replace(reg, replacement ?? '') || '';
            }
        }
        return modifiedEvent;
    } else {
        return streamEvent;
    }
}