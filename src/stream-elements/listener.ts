import { Types } from '../stream-events/index.js'; 

import EventTranslator from './event-translator.js';
        //^?

export default function ListenForStreamElementsEvents(callback: (event: Types.StreamEvent) => void): void | Error {
    if (!window) {
        return new Error('Window not found, this can only run in a browser');
    }

    window.addEventListener('onEventReceived',
        function (_eventData: any) {
            if (!_eventData || !_eventData.detail || !_eventData.detail.event) return;

            if (typeof _eventData.detail.event.itemId !== 'undefined') {
                _eventData.detail.listener = 'redemption-latest';
            }

            const streamElementEvent = {
                ..._eventData.detail.event,
                type: _eventData.detail.listener.split("-")[0]
            }
            //console.log('raw se: ',streamElementEvent);
            const aonyxStreamEvent = EventTranslator(streamElementEvent);
            if (aonyxStreamEvent) {
                callback(aonyxStreamEvent);
            }
        }
    );
}
