import * as StreamCharacters from '@aonyxbuddy/streamcharacters';
import * as StreamEvents  from '@aonyxbuddy/streamevents';

export interface IClientConfig {
    id : string;
    png: StreamCharacters.PNG.IPNGRendererOptions;
    nicknames : StreamEvents.Clients.PostProcessors.Nickname.INicknamePostProcessorOptions;
    tts: StreamCharacters.TextToSpeech.StreamElementsTTS.IStreamElementsTTSOptions;
    responses : StreamEvents.Parsers.IStreamEventParserConfig,
    botBlacklist : string[],
    badWords : string[]
}
