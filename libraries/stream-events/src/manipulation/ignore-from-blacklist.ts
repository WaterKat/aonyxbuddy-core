import { Types } from '../index.js';

export function IgnoreFromBlacklist(streamEvent: Types.StreamEvent, blacklist: string[]): Types.StreamEvent {
    if (!blacklist.includes(streamEvent.username))
        return streamEvent;

    const ignoredEvent: Types.StreamEvent = {
        username: streamEvent.username,
        type: 'other',
        original: streamEvent,
        other: {
            ignore_message : `${IgnoreFromBlacklist.name} has set event from ${streamEvent.username} to be ignored.`
        }
    }

    return ignoredEvent;
}