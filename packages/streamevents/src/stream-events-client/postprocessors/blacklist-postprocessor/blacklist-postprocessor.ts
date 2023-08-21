import { StreamEvent } from "../../../stream-events/stream-event";
import { IEventPostProcessor } from "../../ievent-handlers";

export class BlackListPostProcessor implements IEventPostProcessor {
    private blacklistedAccounts: string[] = new Array<string>();
    private whitelistedIDs: string[] = ['command', 'custom'];

    constructor(blacklist: string[]) {
        this.blacklistedAccounts = blacklist;
    }

    process(_event: StreamEvent): StreamEvent {
        if (!this.blacklistedAccounts.includes(_event.username))
            return _event;

        if (this.whitelistedIDs.includes(_event.type))
            return _event;

        const ignoredEvent: StreamEvent = {
            ..._event,
            type: 'ignore',
            ignore_message: `BlackList Post Processor has set ${_event.type} : ${_event.custom_id || 'None'} event to ignored`
        }

        return ignoredEvent;
    }
}
