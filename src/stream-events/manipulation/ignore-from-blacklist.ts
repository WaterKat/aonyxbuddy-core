//import { Types } from '../index.js';
//import { StreamEventType } from '../types.js';
import { AonyxBuddyStreamEvent, AonyxBuddyStreamEventTypes, AonyxBuddyTypescriptIDS } from '@aonyxbuddy/stream-events';

export function IgnoreFromBlacklist(streamEvent: AonyxBuddyStreamEvent, blacklist: string[]): AonyxBuddyStreamEvent {
    if (!blacklist.includes(streamEvent.username))
        return streamEvent;

    const ignoredEvent: AonyxBuddyStreamEvent = {
        tstype: AonyxBuddyTypescriptIDS.STREAM_EVENT,
        username: streamEvent.username,
        type: AonyxBuddyStreamEventTypes.OTHER,
        original: streamEvent,
        other: {
            ignore_message : `${IgnoreFromBlacklist.name} has set event from ${streamEvent.username} to be ignored.`
        }
    }

    return ignoredEvent;
}