import { StreamCharacters, StreamEvents } from '../external';

export interface IClientConfig {
    id : string;
    png: StreamCharacters.PNG.IPNGRendererOptions;
    nicknames : StreamEvents.Clients.PostProcessors.Nickname.INicknamePostProcessorOptions;
    tts: StreamCharacters.TextToSpeech.StreamElementsTTS.IStreamElementsTTSOptions;
    responses : StreamEvents.Parsers.IStreamEventParserConfig,
    botBlacklist : string[],
    badWords : string[]
}
