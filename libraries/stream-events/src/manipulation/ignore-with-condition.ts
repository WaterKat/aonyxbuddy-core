import { Types } from '../index.js';

export function IgnoreWithCondition(streamEvent: Types.StreamEvent, condition: boolean, id?: string): Types.StreamEvent {
    if (condition)
        return streamEvent;

    if (streamEvent.type === 'other' || streamEvent.type === 'command') {
        return streamEvent;
    }

    const ignoredEvent: Types.StreamEvent = {
        username: streamEvent.username,
        type: 'other',
        original: streamEvent,
        other: {
            ignore_message : `${IgnoreWithCondition.name} ${id ? `[${id}]` : ''} has set event from ${streamEvent.username} to be ignored.`
        }
    }

    return ignoredEvent;
}