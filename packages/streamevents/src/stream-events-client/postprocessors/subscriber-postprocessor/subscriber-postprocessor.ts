import { Subscription } from "@aonyxbuddy/subscriptions";
import { StreamEvent } from "../../../stream-events/stream-event";
import { IEventListener, IEventPostProcessor } from "../../ievent-handlers";

export class SubscriberPostProcessor implements IEventPostProcessor, IEventListener {
    eventSubscription: Subscription<StreamEvent> = new Subscription<StreamEvent>();

    process(_event: StreamEvent) : StreamEvent {
        if (_event.type!=='subscriber')
            return _event;

        if (!_event.message || !_event.message.text)
            return _event;

        this.eventSubscription.invoke({
            ..._event,
            type: 'custom',
            custom_id: 'event-subscriber-message',
            custom_args: []
        });

        return _event;
    }
}
