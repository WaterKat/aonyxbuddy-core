//import * as StreamCharacters from '@aonyxbuddy/stream-characters';
import * as StreamEvents from '../stream-events/index.js';
import * as SpriteRendering from '../sprite-rendering/index.js';
import * as TextToSpeech from '../text-to-speech/index.js';

export interface IClientConfig {
    owner_id: string,
    nickname: string,
    nicknames: { [key: string]: string[] },

    spriteRendering: SpriteRendering.Types.ISpriteRendererConfig,
    tts: TextToSpeech.Types.ITextToSpeechOptions,
    blockedWords: string[],

    blacklist: string[],
    botlist: string[],
    responses: {
        [key: string]: {
            [key: string]: string[]
        }
    },
    webSocketToken?: string,
    commandGroup?: string,
    commandIdentifier?: string,
}


// aonyxbuddy_public.users 
interface IAonyxBuddyUser {
    user_id?: number,
    username: string,

    created_at: Date,
}

// aonyxbuddy_public.instances
export interface IAonyxBuddyInstance {
    instance_id?: number,
    user_id?: number, //ref:aonyxbuddy_public.users.user_id
    created_at?: string,

    instance_nickname: string,

    rendering: {
        spriteRendering: SpriteRendering.Types.ISpriteRendererConfig
    },
    texttospeech: TextToSpeech.Types.ITextToSpeechOptions,
    users: {
        nicknames: { [username: string]: string[] },
        botlist: string[],
        blacklist: string[]
    }
    responses: {
        [message: string] : string[]
    },
    commands : { // [trigger][prefix] [action] [argument(s)]
        prefixes: string[],
        actions: string[],
    },
}

interface IAonyxBuddyResponsesRow {
    response_id?: number,
    aonyxbuddy_id: number,
    tags: string[],
    response: string,
}