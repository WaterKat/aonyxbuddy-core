import { Types } from "../../core/stream-events/index.js";

import EventTranslator from "./event-translator.js";
//^?

export default function ListenForStreamElementsEvents(
    callback: (event: Types.TStreamEvent) => void
) {
    if (!window) {
        return new Error("Window not found, this can only run in a browser");
    }

    function OnEvent(_eventData: any) {
        if (!_eventData || !_eventData.detail || !_eventData.detail.event)
            return;

        if (typeof _eventData.detail.event.itemId !== "undefined") {
            _eventData.detail.listener = "redemption-latest";
        }

        const streamElementEvent = {
            ..._eventData.detail.event,
            type: _eventData.detail.listener.split("-")[0]
        }
        //console.log("raw se: ",streamElementEvent);
        const aonyxStreamEvent = EventTranslator(streamElementEvent);
        if (aonyxStreamEvent) {
            callback(aonyxStreamEvent);
        }
    }

    window.addEventListener("onEventReceived", OnEvent);

    return {
        RemoveListener:
            () => window.removeEventListener("onEventReceived", OnEvent)
    };
}