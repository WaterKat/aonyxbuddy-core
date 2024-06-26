//import * as StreamCharacters from '@aonyxbuddy/stream-characters';
import * as StreamEvents from '../core/stream-events/index.js';
import * as SpriteRendering from '../ui/sprite-rendering/index.js';
import { StreamElementsVoiceID } from '../ui/audio/index.js';

export interface IClientConfig {
    owner_id: string,
    nickname: string,
    nicknames: { [key: string]: string[] },
    spriteRendering: SpriteRendering.ILegacyConfig,
    tts: {
        voice?: StreamElementsVoiceID
        context?: AudioContext,
        normalize?: boolean,
        downmix_to_mono?: boolean
    },
    blacklist: string[],
    botlist: string[],
    blockedWords: string[],
    responses: {
        [key: string]: {
            [key: string]: string[]
        }
    },
    webSocketToken?: string,
    commandGroup?: string,
    commandIdentifier?: string,
}

// aonyxbuddy_configs@aonyxbuddy
interface IAonyxBuddyConfig  {
    aonyxbuddy_id?: number,
    owner_id: string, // ref: users@auth
    nickname: string,
}

interface IAonyxBuddyResponsesRow {
    response_id?: number,
    aonyxbuddy_id: number,
    tags: string[],
    response: string,
}