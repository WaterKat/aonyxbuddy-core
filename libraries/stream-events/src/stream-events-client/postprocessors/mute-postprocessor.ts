import { StreamEvent } from '../../types.js';
import { IEventPostProcessor } from '../ievent-handlers.js';

export class MuteCommandPostProcessor implements IEventPostProcessor {
    private isIgnoring: boolean = false;

    private identifier: string = '!';
    private group: string = 'frank';
    private request: string = 'mute';
    private request_cancel: string = 'unmute';

    private whiteListedIDs: string[] = ['command', 'ignore'];

    constructor(identifier?: string, group?: string, request?: string, request_cancel?: string) {
        this.identifier = identifier ?? this.identifier;
        this.group = group ?? this.group;
        this.request = request ?? this.request;
        this.request_cancel = request_cancel ?? this.request_cancel;
    }

    process(_event: StreamEvent): StreamEvent {
        if (_event.type === 'command') {
            if (this.identifier === _event.command_identifier &&
                this.group === _event.command_group) {
                if (this.request === _event.command_request) {
                    this.isIgnoring = true;
                } else if (this.request_cancel === _event.command_request) {
                    this.isIgnoring = false;
                }  
            }
        }
        
        if (this.whiteListedIDs.includes(_event.type)){
            return _event;
        }

        if (!this.isIgnoring){
            return _event;
        }

        const ignoredEvent: StreamEvent = {
            ..._event,
            type: 'ignore',
            ignore_message : 'Mute Post Processor has set this event to ignored'
        }

        return ignoredEvent;
    }
}
