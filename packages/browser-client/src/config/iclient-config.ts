//import * as StreamCharacters from '@aonyxbuddy/stream-characters';
import * as StreamEvents  from '@aonyxbuddy/stream-events';
import * as SpriteRendering from '@aonyxbuddy/sprite-rendering'
import * as TextToSpeech from '@aonyxbuddy/text-to-speech'

export interface IClientConfig {
    id : string,
    name: string,
    spriteRendering: SpriteRendering.Types.ISpriteRendererConfig,
    nicknames : { [key: string]: string[]},
    tts: TextToSpeech.Types.ITextToSpeechConfig,
    blacklist: string[],
    botlist : string[],
    blockedWords : string[],
    responses : {
        [key: string] : { [key: string]: string[]}
    }
}
