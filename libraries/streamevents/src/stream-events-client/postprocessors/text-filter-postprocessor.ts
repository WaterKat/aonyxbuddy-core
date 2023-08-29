import { StreamEvent, StreamEventComponent } from '../../stream-events/index.js';
import { IEventPostProcessor } from '../ievent-handlers.js';
import messageMiddleware from './message-middleware.js';

export default (function (_bannedWords: string[] = [], _caseSensitive: boolean = false, _replacement: string = '', _enableLogging = false): IEventPostProcessor {
    const textProcessor = messageMiddleware();

    function filter(message: StreamEventComponent.Message): StreamEventComponent.Message {
        const newText = message;
        _bannedWords.forEach(word => {
            if (_caseSensitive) {
                newText.text = newText.text.replace(word, _replacement);
            } else {
                const esc = word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
                const reg = new RegExp(esc, 'ig');
                newText.text = newText.text?.replace(reg, _replacement) || '';
            }
        });
        return newText;
    }

    function process(_originalEvent: StreamEvent): StreamEvent {
        if (_enableLogging){
            console.log(_originalEvent);
        }
        return textProcessor.process(_originalEvent, filter);
    }

    return {
        process
    }
});
