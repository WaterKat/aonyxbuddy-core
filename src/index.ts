
import { IClientConfig } from "config/iclient-config";

import GetTextToSpeech from "text-to-speech/index";

function GetAonyxBuddyInstance(config: IClientConfig) {
    const tts = GetTextToSpeech(config.tts)

    return {
        TextToSpeech: tts
    };
}