import { StreamEvent, StreamEventType } from '../stream-events/types.js';

export default function GetAonyxBuddyStreamEventListener(callback: (event: StreamEvent) => void): void | Error {
    if (!window) {
        return new Error('Window not found, this can only run in a browser');
    }

    window.addEventListener(StreamEventType.TS_TYPE,
        function (_eventData: any) {
            console.log('Stream Event Listener', _eventData);
            if (!_eventData || !_eventData.detail) return;

            if (_eventData.detail.tstype !== StreamEventType.TS_TYPE) return;

            console.log(_eventData);

            callback(_eventData.detail);
        }
    );
}
