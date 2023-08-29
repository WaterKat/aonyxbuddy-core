import { StreamEventTypeID } from '../stream-events/stream-event.js';

export type Response = {
    [key in StreamEventTypeID]: string[];
} & {
    [key: string]: string[];
};

export interface IResponses {
    voice: Response;
    chat: Response;
}

export interface IVariableReplacements {
    [key: string]: string;
}
