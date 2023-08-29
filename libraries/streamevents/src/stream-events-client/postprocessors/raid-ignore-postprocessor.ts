import { StreamEvent } from '../../stream-events/stream-event.js';
import { IEventPostProcessor } from '../ievent-handlers.js';

export class RaidIgnorePostProcessor implements IEventPostProcessor {
    private timeoutInSeconds: number = 30;
    private isIgnoring: boolean = false;
    private latestRaidTime: Date = new Date('2000-01-01T00:00:00.000Z');
    private blackListedEventIDs :  string[] = ['chat','follow']

    constructor(timeoutInSeconds?: number, blackListedEventIDs? : string[]) {
        if (timeoutInSeconds){
            if (!isNaN(timeoutInSeconds)){
                this.timeoutInSeconds = timeoutInSeconds;
            }
        }

        if (blackListedEventIDs){
            this.blackListedEventIDs = blackListedEventIDs;
        }
    }

    process(_event: StreamEvent): StreamEvent {
        if (_event.type === 'raid') {
            this.isIgnoring = true;
            this.latestRaidTime = new Date();
            return _event;
        }

        if (!this.blackListedEventIDs.includes(_event.type)){
            return _event;
        }

        if (!this.isIgnoring) {
            return _event;
        }

        const timeDifferenceInSeconds = ((new Date().getTime()) - this.latestRaidTime.getTime()) / 1000;

        if (timeDifferenceInSeconds > this.timeoutInSeconds) {
            this.isIgnoring = false;
            return _event;
        }

        const ignoredEvent: StreamEvent = {
            ..._event,
            type: 'ignore',
            ignore_message : 'Raid Ignore Post Processor has set this event to ignored'
        }

        return ignoredEvent;
    }
}
