import { Types } from '../index.js';
import { StreamEventType } from '../types.js';

export function IgnoreFromBlacklist(streamEvent: Types.StreamEvent, blacklist: string[]): Types.StreamEvent {
    if (!blacklist.includes(streamEvent.username))
        return streamEvent;

    const ignoredEvent: Types.StreamEvent = {
        tstype: StreamEventType.TS_TYPE,
        username: streamEvent.username,
        type: StreamEventType.OTHER,
        original: streamEvent,
        other: {
            ignore_message : `${IgnoreFromBlacklist.name} has set event from ${streamEvent.username} to be ignored.`
        }
    }

    return ignoredEvent;
}