import * as IStreamEventParserComponents from './Istream-event-parser-components.js';
export * as IStreamEventParserComponents from './Istream-event-parser-components.js';


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

