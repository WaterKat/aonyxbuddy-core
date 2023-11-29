import { Types } from '../index.js';
export declare function DetectFirstEvent(streamEvent: Types.StreamEvent, callback?: (streamEvent: Types.StreamEvent) => void, usernames?: string[]): Types.StreamEvent;
export declare function ResetDetectFirstEvent(): void;
