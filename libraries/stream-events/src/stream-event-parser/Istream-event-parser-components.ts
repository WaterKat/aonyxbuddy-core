import { StreamEventTypeID } from '../types.js';

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