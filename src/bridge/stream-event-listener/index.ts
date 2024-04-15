import { TStreamEvent, EStreamEventType } from '../../core/stream-events/types.js';

export function GetAonyxBuddyStreamEventListener(callback: (
    event: TStreamEvent) => void
): void | Error {
    if (!window) {
        return new Error('Window not found, this can only run in a browser');
    }

    function OnEvent(_eventData: any) {
        {
            //console.log('Stream Event Listener', _eventData);
            if (!_eventData || !_eventData.detail) return;

            if (_eventData.detail.tstype !== EStreamEventType.TS_TYPE) return;

            //console.log(_eventData);

            callback(_eventData.detail);
        }

        window.addEventListener(EStreamEventType.TS_TYPE, OnEvent);

        return {
            RemoveListener: () =>
                window.removeEventListener(EStreamEventType.TS_TYPE, OnEvent)
        };
    }

    export default GetAonyxBuddyStreamEventListener;
