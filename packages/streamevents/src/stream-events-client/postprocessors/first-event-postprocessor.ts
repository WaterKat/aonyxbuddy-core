import { Subscription } from '@aonyxbuddy/subscriptions';

import { StreamEvent } from "../../stream-events/stream-event";
import { IEventListener, IEventPostProcessor } from "../ievent-handlers";

export class FirstEventPostProcessor implements IEventPostProcessor, IEventListener {
    eventSubscription: Subscription<StreamEvent> = new Subscription<StreamEvent>();

    private helloMessageTimeIntervalInSeconds : number = 5;
    private usernameArray : string[] = [];

    process(_event: StreamEvent) : StreamEvent {
        if (!this.usernameArray.includes(_event.username)){
            this.usernameArray.push(_event.username);

            if (_event.type === 'chat'){
                setTimeout(()=>{
                    this.eventSubscription.invoke({
                        ..._event,
                        type: 'custom',
                        custom_id : 'event-first-message',
                        custom_args : []
                    });
                }, 1000 * this.helloMessageTimeIntervalInSeconds)
            }
        }
        return _event;
    }
}
