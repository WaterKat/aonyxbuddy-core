import { Types } from '../index.js';

export function IgnoreFromBotlist(streamEvent: Types.StreamEvent, botlist: string[]): Types.StreamEvent {
    if (!botlist.includes(streamEvent.username))
        return streamEvent;

    if (streamEvent.type === 'other' || streamEvent.type === 'command') {
        return streamEvent;
    }

    const ignoredEvent: Types.StreamEvent = {
        username: streamEvent.username,
        type: 'other',
        original: streamEvent,
        other: {
            ignore_message : `${IgnoreFromBotlist.name} has set event from ${streamEvent.username} to be ignored.`
        }
    }

    return ignoredEvent;
}