import {
    TStreamEvent, EStreamEventType
} from '../../core/stream-events/types.js';
import { IsObject, IsString } from "../../lib.js";

function ContainsKey<T extends object, K extends string>(
  value: unknown, 
  key: K
): value is T & Record<K, unknown> {
  return value !== null && typeof value === 'object'  && Object.prototype.hasOwnProperty.call(value, key);
}

export function GetAonyxBuddyStreamEventListener(callback: (
    event: TStreamEvent) => void
) {
    if (!window) {
        console.warn(
            new Error('Window not found, this can only run in a browser')
        );
        return undefined;
    }



    function OnEvent(_eventData: unknown) {
      if (!IsObject(_eventData))  return;
      if (!ContainsKey(_eventData, 'detail')) return;
      if (!IsObject(_eventData.detail)) return;
      if (!ContainsKey(_eventData.detail, 'tstype')) return;
      if (!IsString(_eventData.detail.tstype)) return;
      if (_eventData.detail.tstype !== EStreamEventType.TS_TYPE)
        return undefined;
      
      //! By this point, we know that the event is likely a TStreamEvent
      callback(_eventData.detail as TStreamEvent);
    }

    window.addEventListener(EStreamEventType.TS_TYPE, OnEvent);

    return {
        RemoveListener: () =>
            window.removeEventListener(EStreamEventType.TS_TYPE, OnEvent)
    };
}
