import { Types } from '../index.js';

export function DetectEventOfType(streamEvent: Types.StreamEvent, type: Types.StreamEventTypeID | 'other', callback: (streamEvent: Types.StreamEvent) => void) : Types.StreamEvent {
    if (streamEvent.type === type) {
        callback(streamEvent);
    }
    return streamEvent;
}