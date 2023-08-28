//import { Tools, StreamEvents } from "../../../../aonyx-packages/lib";
import { Subscription } from '@aonyxbuddy/subscriptions';
import { StreamEvent } from '../../../stream-events/index';

import { TranslateStreamElementsEventToAonyxEvent } from './stream-elements-event-translator';

export class StreamElementsEventListener {
    eventSubscription = new Subscription<StreamEvent>();
    boundEventProcessor: (_event: any) => void;

    constructor() {
        this.boundEventProcessor = this.processEvent.bind(this);

        if (typeof window !== 'undefined') {
            window.addEventListener('onEventReceived', this.boundEventProcessor);
        } else {
            console.warn('App is not running within a browser window');
        }
    }

    private processEvent(_eventData: any) {
        if (!_eventData.detail.event)
            return;

        if (typeof _eventData.detail.event.itemId !== 'undefined') {
            _eventData.detail.listener = 'redemption-latest';
        }

        const streamElementEvent = {
            ..._eventData.detail.event,
            type: _eventData.detail.listener.split("-")[0]
        }

        const aonyxStreamEvent = TranslateStreamElementsEventToAonyxEvent(streamElementEvent);
        if (aonyxStreamEvent) {
            this.eventSubscription.invoke(aonyxStreamEvent);
        }
    }
}
