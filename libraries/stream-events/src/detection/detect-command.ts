import { Types } from '../index.js';

export function DetectCommand(streamEvent: Types.StreamEvent, callback: (streamEvent: Types.StreamEvent) => void) : Types.StreamEvent {
    if (streamEvent.type === 'command'){
        callback(streamEvent);
    }
    return streamEvent;
}