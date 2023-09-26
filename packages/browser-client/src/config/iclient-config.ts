import * as StreamCharacters from '@aonyxbuddy/stream-characters';
import * as StreamEvents  from '@aonyxbuddy/stream-events';
import * as SpriteRendering from '@aonyxbuddy/sprite-rendering'

export interface IClientConfig {
    id : string,
    name: string,
    spriteRendering: SpriteRendering.Types.ISpriteRendererConfig,
    nicknames : { [key: string]: string[]},
    tts: StreamCharacters.TextToSpeech.StreamElementsTTS.IStreamElementsTTSOptions,
    blacklist: string[],
    botlist : string[],
    blockedWords : string[],
    responses : {
        [key: string] : { [key: string]: string[]}
    }
}
