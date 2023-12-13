import { StreamEvent, StreamEventType } from '../types.js';

function IgnoreEvent(streamEvent: StreamEvent, id?: string) {
    const ignoredEvent: StreamEvent = {
        tstype: StreamEventType.TS_TYPE,
        username: streamEvent.username,
        type: StreamEventType.OTHER,
        original: streamEvent,
        other: {
            ignore_message : `${IgnoreCommandWithoutPermission.name} ${id ? `[${id}]` : ''} has set event from ${streamEvent.username} to be ignored.`
        }
    }

    return ignoredEvent;
}

export function IgnoreCommandWithoutPermission(streamEvent: StreamEvent, id?: string): StreamEvent {
    if (streamEvent.type !== 'command')
        return streamEvent;

    if (!streamEvent.permissions) {
        return IgnoreEvent(streamEvent, id);
        console.error('Permissions not set, must be set to use commands');
    }
    if (!streamEvent.permissions.streamer && !streamEvent.permissions.moderator)
        return IgnoreEvent(streamEvent, id);

    return streamEvent;
}