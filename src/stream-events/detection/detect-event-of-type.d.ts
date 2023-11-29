import { Types } from '../index.js';
export declare function DetectEventOfType(streamEvent: Types.StreamEvent, type: Types.StreamEventTypeID | 'other', callback: (streamEvent: Types.StreamEvent) => void): Types.StreamEvent;
