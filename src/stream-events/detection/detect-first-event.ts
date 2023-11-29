import { Types } from '../index.js';

const globalUsernames: string[] = [];


export function DetectFirstEvent(streamEvent: Types.StreamEvent, callback?: (streamEvent: Types.StreamEvent) => void, usernames?: string[]): Types.StreamEvent {
    const functionName = 'DetectFirstEvent';

    const activeUsernameArray = usernames ?? globalUsernames;

    if (!activeUsernameArray.includes(streamEvent.username)) {
        activeUsernameArray.push(streamEvent.username);
        if (callback) {
            callback({
                ...streamEvent,
                type: 'other',
                original: streamEvent,
                other: {
                    type: "chat-first"
                }
            });
        }
    } else {
        console.log('global usernames: ', globalUsernames);
    }

    return streamEvent;
}

export function ResetDetectFirstEvent() {
    globalUsernames.length = 0;
}