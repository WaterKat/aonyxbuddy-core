//import * as StreamCharacters from '@aonyxbuddy/stream-characters';
import * as StreamEvents  from '../stream-events/index.js';
import * as SpriteRendering from '../sprite-rendering/index.js';
import * as TextToSpeech from '../text-to-speech/index.js';

export interface IClientConfig {
    id : string,
    name: string,
    spriteRendering: SpriteRendering.Types.ISpriteRendererConfig,
    nicknames : { [key: string]: string[]},
    tts: TextToSpeech.Types.ITextToSpeechOptions,
    blacklist: string[],
    botlist : string[],
    blockedWords : string[],
    responses : {
        [key: string] : { [key: string]: string[]}
    },
    webSocketToken?: string,
    commandGroup?: string,
    commandIdentifier?: string,
}
