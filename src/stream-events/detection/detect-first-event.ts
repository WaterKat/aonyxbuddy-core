import { StreamEvent, StreamEventType } from '../types.js';

const globalUsernames: string[] = [];


export function DetectFirstEvent(streamEvent: StreamEvent, callback?: (streamEvent: StreamEvent) => void, usernames?: string[]): StreamEvent {
    const functionName = 'DetectFirstEvent';

    const activeUsernameArray = usernames ?? globalUsernames;

    if (!activeUsernameArray.includes(streamEvent.username)) {
        activeUsernameArray.push(streamEvent.username);
        if (callback) {
            callback({
                ...streamEvent,
                type: StreamEventType.OTHER,
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