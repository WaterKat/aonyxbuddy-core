//import { StreamEvent, StreamEventType } from '../stream-events/types.js';

import { AonyxBuddyStreamEvent, AonyxBuddyTypescriptIDS} from "@aonyxbuddy/stream-events";

export default function GetAonyxBuddyStreamEventListener(callback: (event:  AonyxBuddyStreamEvent) => void): void | Error {
    if (!window) {
        return new Error('Window not found, this can only run in a browser');
    }

    window.addEventListener(AonyxBuddyTypescriptIDS.STREAM_EVENT,
        function (_eventData: any) {
            console.log('Stream Event Listener', _eventData);
            if (!_eventData || !_eventData.detail) return;

            if (_eventData.detail.tstype !== AonyxBuddyTypescriptIDS.STREAM_EVENT) return;

            console.log(_eventData);

            callback(_eventData.detail);
        }
    );
}
