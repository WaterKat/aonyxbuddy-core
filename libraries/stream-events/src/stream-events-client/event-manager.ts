import { StreamEvent } from '../stream-events/index.js';
import { IEventListener, IEventManager, IEventPostProcessor } from './ievent-handlers.js';
import { Subscription } from "@aonyxbuddy/subscriptions";

export class EventManager implements IEventManager {
    eventSubscription = new Subscription<StreamEvent>();
    postProcessors: IEventPostProcessor[] = [];

    attachListener(_listener: IEventListener) {
        _listener.eventSubscription.subscribe((event: StreamEvent) =>
            this.passthrough(event));
    }

    detachListener(_listener: IEventListener) {
        _listener.eventSubscription.unsubscribe((event: StreamEvent) =>
            this.passthrough(event));
    }

    attachPostProcessor(_postProcessor: IEventPostProcessor) {
        if (!this.postProcessors.includes(_postProcessor)) {
            this.postProcessors.push(_postProcessor);
        }
    }

    detachPostProcessor(_postProcessor: IEventPostProcessor) {
        const indexOf = this.postProcessors.indexOf(_postProcessor);
        if (indexOf > -1) {
            this.postProcessors.splice(indexOf, 1);
        }
    }

    private passthrough(_event: StreamEvent) {
        let processedEvent = _event;
        this.postProcessors.forEach(_postProcessor => {
            processedEvent = _postProcessor.process(processedEvent);
        });
        this.eventSubscription.invoke(processedEvent);
    }
}
