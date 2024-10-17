import * as Types from "../../core/stream-events/index.js";
import { ObjectContainsKey, ObjectMatchesTemplate } from "../../lib.js";

import EventTranslator from "./translate-event-to-aonyxbuddy.js";
import { SERawEvent, SERawEventTemplate } from "./types.js";
//^?

export function ListenForStreamElementsEvents(
  callback: (event: Types.TStreamEvent) => void
) {
  if (!window) {
    console.warn(new Error("Window not found, this can only run in a browser"));
    return undefined;
  }

  function OnEvent(_eventData: unknown) {
    if (!ObjectMatchesTemplate<SERawEvent>(_eventData, SERawEventTemplate))
      return;

    if (
      ObjectContainsKey(_eventData.detail.event, "itemId") &&
      _eventData.detail.event.itemId !== undefined
    ) {
      _eventData.detail.listener = "redemption-latest";
    }

    const streamElementEvent = {
      ..._eventData.detail.event,
      type: _eventData.detail.listener.split("-")[0],
    };
    //console.log("raw se: ",streamElementEvent);
    const aonyxStreamEvent = EventTranslator(streamElementEvent);
    if (aonyxStreamEvent) {
      callback(aonyxStreamEvent);
    }
  }

  window.addEventListener("onEventReceived", OnEvent);

  return {
    RemoveListener: () =>
      window.removeEventListener("onEventReceived", OnEvent),
  };
}
