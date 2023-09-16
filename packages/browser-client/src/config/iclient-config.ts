import * as StreamCharacters from '@aonyxbuddy/stream-characters';
import * as StreamEvents  from '@aonyxbuddy/stream-events';

export interface IClientConfig {
    id : string;
    name: string;
    png: StreamCharacters.PNG.IPNGRendererOptions;
    nicknames : StreamEvents.Clients.PostProcessors.Nickname.INicknamePostProcessorOptions;
    tts: StreamCharacters.TextToSpeech.StreamElementsTTS.IStreamElementsTTSOptions;
    responses : StreamEvents.Parsers.IStreamEventParserConfig,
    botBlacklist : string[],
    badWords : string[]
}
