//import * as StreamCharacters from '@aonyxbuddy/stream-characters';
import * as StreamEvents from '../../stream-events/index.js';
import * as SpriteRendering from '../../sprite-rendering/index.js';
import * as TextToSpeech from '../../text-to-speech/index.js';

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
