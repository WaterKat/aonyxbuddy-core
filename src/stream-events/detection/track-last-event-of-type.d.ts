import { Types } from '../index.js';
interface IEventTimeMap {
    [key: string]: Date;
}
export declare const globalEventTimeMap: IEventTimeMap;
export declare function TrackEventTimes(streamEvent: Types.StreamEvent, eventTimeMap?: IEventTimeMap): Types.StreamEvent;
export {};
