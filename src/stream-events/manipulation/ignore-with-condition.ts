//import { StreamEvent, StreamEventType } from '../types.js';
import { AonyxBuddyStreamEvent as StreamEvent, AonyxBuddyStreamEventTypes as StreamEventType, AonyxBuddyTypescriptIDS } from "@aonyxbuddy/stream-events";

export function IgnoreWithCondition(streamEvent: StreamEvent, condition: boolean, id?: string): StreamEvent {
    if (condition)
        return streamEvent;

    if (streamEvent.type === 'other' || streamEvent.type === 'command') {
        return streamEvent;
    }

    const ignoredEvent: StreamEvent = {
        tstype: AonyxBuddyTypescriptIDS.STREAM_EVENT,
        username: streamEvent.username,
        type: StreamEventType.OTHER,
        original: streamEvent,
        other: {
            ignore_message : `${IgnoreWithCondition.name} ${id ? `[${id}]` : ''} has set event from ${streamEvent.username} to be ignored.`
        }
    }

    return ignoredEvent;
}