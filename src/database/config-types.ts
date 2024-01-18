import * as SpriteRendering from '../sprite-rendering/index.js';
import * as TextToSpeech from '../text-to-speech/index.js';

// aonyxbuddy_public.instances

export interface IAonyxBuddyInstance {
    instance_id?: number,
    user_id?: number, //ref:aonyxbuddy_public.users.user_id
    created_at?: string,
    owner?: IAonyxBuddyUser,

    instance_nickname: string,
    rendering: {
        spriteRendering: SpriteRendering.Types.ISpriteRendererConfig;
    },
    texttospeech: TextToSpeech.Types.ITextToSpeechOptions,
    users: {
        nicknames: { [username: string]: string[]; };
        botlist: string[];
    },
    responses: {
        [message: string]: string[];
    },
    commands: {
        prefixes: string[];
        actions: string[];
    },
    security: {
        blacklist: string[],
        blockedWords: string[],
    }
}// aonyxbuddy_public.users 


export interface IAonyxBuddyUser {
    user_id?: number;
    created_at?: Date;
    username: string;
}

