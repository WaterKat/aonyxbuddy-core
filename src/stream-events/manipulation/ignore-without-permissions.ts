import { Types } from '../index.js';

function IgnoreEvent(streamEvent: Types.StreamEvent, id?: string) {
    const ignoredEvent: Types.StreamEvent = {
        username: streamEvent.username,
        type: 'other',
        original: streamEvent,
        other: {
            ignore_message : `${IgnoreCommandWithoutPermission.name} ${id ? `[${id}]` : ''} has set event from ${streamEvent.username} to be ignored.`
        }
    }

    return ignoredEvent;
}

export function IgnoreCommandWithoutPermission(streamEvent: Types.StreamEvent, id?: string): Types.StreamEvent {
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