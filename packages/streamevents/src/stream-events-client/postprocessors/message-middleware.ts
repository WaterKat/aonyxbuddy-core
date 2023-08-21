import { StreamEvent, StreamEventComponent } from "../../stream-events";

export default (function (_enableLogging = false) {
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
