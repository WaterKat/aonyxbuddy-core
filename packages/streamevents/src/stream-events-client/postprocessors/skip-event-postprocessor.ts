import { StreamEvent } from "../../stream-events/stream-event";
import { IEventPostProcessor } from "../ievent-handlers";

export class SkipEventCommandPostProcessor implements IEventPostProcessor {
    private skipCount: number = 0;

    private identifier: string = '!';
    private group: string = 'frank';
    private request: string = 'skip';

    private whiteListedIDs: string[] = ['command', 'ignore'];

    constructor(identifier?: string, group?: string, request?: string) {
        this.identifier = identifier ?? this.identifier;
        this.group = group ?? this.group;
        this.request = request ?? this.request;
    }

    process(_event: StreamEvent): StreamEvent {
        if (_event.type === 'command') {
            if (this.identifier === _event.command_identifier &&
                this.group === _event.command_group) {
                if (this.request === _event.command_request) {
                    const args = _event.command_args.trim();
                    if (args.length < 1) {
                        this.skipCount += 1;
                    }else if (!isNaN(+args)) {
                        this.skipCount += (+args);
                    } else if (args.includes('reset')) {
                        this.skipCount = 0;
                    }
                }
            }
        }

        if (this.whiteListedIDs.includes(_event.type)) {
            return _event;
        }

        if (this.skipCount < 1) {
            return _event;
        }

        this.skipCount -= 1;

        const ignoredEvent: StreamEvent = {
            ..._event,
            type: 'ignore',
            ignore_message: `Skip Event Post Processor has set this event to ignored. There are ${this.skipCount} skips left.`
        }

        return ignoredEvent;
    }
}
