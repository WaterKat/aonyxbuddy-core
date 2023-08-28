import { StreamEvent } from '../../../stream-events/stream-event';
import { IEventPostProcessor } from '../../ievent-handlers';

export class SkipEventCommandPostProcessor implements IEventPostProcessor {
    process(_event: StreamEvent): StreamEvent {
        if (_event.type !== 'command') {
            return _event;
        }

        if (_event.permissions && (_event.permissions.moderator || _event.permissions.streamer)) {
            return _event;
        }

        const ignoredEvent: StreamEvent = {
            ..._event,
            type: 'ignore',
            ignore_message: `Command Permission Post Processor has set this event to ignored. ${_event.username} has permissions ${_event.permissions}`
        }

        return ignoredEvent;
    }
}
