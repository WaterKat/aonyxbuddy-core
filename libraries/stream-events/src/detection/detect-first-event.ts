import { Types } from '../index.js';

const globalUsernames: string[] = [];

export function DetectFirstEventPerUsername(streamEvent: Types.StreamEvent, callback?: (streamEvent: Types.StreamEvent) => void, usernames?: string[]) : Types.StreamEvent {
    const activeUsernameArray = usernames ?? globalUsernames;

    if (!activeUsernameArray.includes(streamEvent.username)){
        activeUsernameArray.push(streamEvent.username);
        if (callback) callback(streamEvent);
    }

    return streamEvent;
}

export function ResetDetectFirstEvent() {
    globalUsernames.length = 0;
}