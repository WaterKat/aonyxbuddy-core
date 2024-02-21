
import { IClientConfig } from "./config/iclient-config.js";

import GetTextToSpeech from "./text-to-speech/index.js";
import { GetTextQueue } from "./queues/text-queue.js";

function GetAonyxBuddyInstance(config: IClientConfig) {
    const tts = GetTextToSpeech(config.tts)
    const speechAmplitudeVariable = { 
        value: 0
    }
    const textqueue = GetTextQueue(tts, speechAmplitudeVariable)
    return {
        TextToSpeech: tts,
        TextQueue: textqueue
    };
}