import { StreamEvent } from '../../../types.js';
import { IEventPostProcessor } from '../../ievent-handlers.js';

export class CommandSayPostProcessor implements IEventPostProcessor {

    private identifier: string = '!';
    private group: string = 'frank';
    private request: string = 'say';

    constructor(identifier?: string, group?: string, request?: string) {
        this.identifier = identifier ?? this.identifier;
        this.group = group ?? this.group;
        this.request = request ?? this.request;
    }

    process(_event: StreamEvent): StreamEvent {
        if (_event.type !== 'command')
            return _event;

        if (_event.command_identifier !== this.identifier || _event.command_group !== this.group || _event.command_request !== this.request)
            return _event;

        const customEvent: StreamEvent = {
            ..._event,
            type: 'custom',
            custom_id: 'command-say',
            custom_args: [],
            message: {
                text: _event.command_args,
                emotes: []
            }
        }

        return customEvent;
    }
}
