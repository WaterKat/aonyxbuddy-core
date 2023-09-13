import { StreamEvent, StreamEventComponent } from '../../stream-events/index.js';

export default (function () {
    function process(_originalEvent: StreamEvent, filter: (_text: StreamEventComponent.Message) => StreamEventComponent.Message): StreamEvent {

        if (_originalEvent.message){
            _originalEvent.message = filter(_originalEvent.message);
        }
        
        return _originalEvent;
    }

    return {
        process
    }
});
