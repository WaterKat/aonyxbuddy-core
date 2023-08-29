import { StreamEvent, StreamEventComponent }  from '../../stream-events/index.js';
import { IEventPostProcessor } from '../ievent-handlers.js';

import messageMiddleware from './message-middleware.js';

export default (function (_replacement: string = ''): IEventPostProcessor {

   const messageProcessor = messageMiddleware();

    const EmojiRegex : RegExp = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g

    function filter(_message: StreamEventComponent.Message): StreamEventComponent.Message {
        _message.text = _message.text.replace(EmojiRegex, _replacement);
        return _message;
    }

    function process(_originalEvent: StreamEvent): StreamEvent {
        return messageProcessor.process(_originalEvent, filter);
    }

    return {
        process
    }
});
