import { StreamEventTypeID } from '../stream-events/stream-event';

export type UserType =
    'bot' | 'chatter' |
    'follower' |
    'subscriber-prime' | 'subscriber-tier1' | 'subscriber-tier2' | 'subscriber-tier3' |
    'vip' |
    'moderator' | 'moderator-editor' | 'streamer' |
    'admin';

export type EventTriggers = 'voice' | 'chat' | 'command';

export interface IStreamEventParseInfo {
    userType: UserType;

}

export interface IStreamEventParserConfig {
    responses: IStreamEventParserComponents.IResponses
}

export namespace IStreamEventParserComponents{
    export type Response = {
        [key in StreamEventTypeID]: string[]
    } & {
        [key: string]: string[]
    }

    export interface IResponses {
        voice : Response,
        chat : Response
    }

    export interface IVariableReplacements {
        [key : string] : string
    }
}
