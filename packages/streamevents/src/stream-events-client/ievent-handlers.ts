import { Subscription } from "@aonyxbuddy/subscriptions";
import { StreamEvent } from "../stream-events/stream-event";

export interface IEventListener {
    eventSubscription: Subscription<StreamEvent>;
}

export interface IEventPostProcessor {
    process: (_event: StreamEvent) => StreamEvent;
}

export interface IEventManager extends IEventListener {
    attachListener: (_listener: IEventListener) => void;
    detachListener: (_listener: IEventListener) => void;
    attachPostProcessor: (_postProcessor: IEventPostProcessor) => void;
    detachPostProcessor: (_postProcessor: IEventPostProcessor) => void;
}

