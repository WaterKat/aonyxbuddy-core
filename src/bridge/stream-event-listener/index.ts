import {
    TStreamEvent, EStreamEventType
} from '../../core/stream-events/types.js';

export function GetAonyxBuddyStreamEventListener(callback: (
    event: TStreamEvent) => void
) {
    if (!window) {
        console.warn(
            new Error('Window not found, this can only run in a browser')
        );
        return undefined;
    }

    function OnEvent(_eventData: any) {
        if (!_eventData || !_eventData.detail)
            return undefined;

        if (_eventData.detail.tstype !== EStreamEventType.TS_TYPE)
            return undefined;

        //console.log(_eventData);

        callback(_eventData.detail);
    }

    window.addEventListener(EStreamEventType.TS_TYPE, OnEvent);

    return {
        RemoveListener: () =>
            window.removeEventListener(EStreamEventType.TS_TYPE, OnEvent)
    };
}
