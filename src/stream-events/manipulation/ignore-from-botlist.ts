import { StreamEvent, StreamEventType } from '../types.js';

export function IgnoreFromBotlist(streamEvent: StreamEvent, botlist: string[]): StreamEvent {
    if (!botlist.includes(streamEvent.username))
        return streamEvent;

    if (streamEvent.type === 'other' || streamEvent.type === 'command') {
        return streamEvent;
    }

    const ignoredEvent: StreamEvent = {
        tstype: StreamEventType.TS_TYPE,
        username: streamEvent.username,
        type: StreamEventType.OTHER,
        original: streamEvent,
        other: {
            ignore_message : `${IgnoreFromBotlist.name} has set event from ${streamEvent.username} to be ignored.`
        }
    }

    return ignoredEvent;
}