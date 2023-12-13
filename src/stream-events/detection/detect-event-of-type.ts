import { StreamEvent, StreamEventType } from '../types.js';

export function DetectEventOfType(streamEvent: StreamEvent, type: StreamEventType, callback: (streamEvent: StreamEvent) => void) : StreamEvent {
    if (streamEvent.type === type) {
        callback(streamEvent);
    }
    return streamEvent;
}