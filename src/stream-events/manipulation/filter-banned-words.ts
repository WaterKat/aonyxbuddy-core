import { AonyxBuddyStreamEvent } from "@aonyxbuddy/stream-events";

export function FilterBannedWords(streamEvent: AonyxBuddyStreamEvent, bannedWords: string[], replacement: string = '', caseSensitive: boolean = false): Types.StreamEvent {
    const modifiedEvent: AonyxBuddyStreamEvent = {
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