import { Types } from '../index.js';

interface IEventTimeMap {
    [key: string]: Date
}

export const globalEventTimeMap: IEventTimeMap = {};

export function TrackEventTimes(streamEvent: Types.StreamEvent, eventTimeMap?: IEventTimeMap): Types.StreamEvent {
    (eventTimeMap ?? globalEventTimeMap)[streamEvent.type] = new Date();
    return streamEvent;
}
