import { GetTextQueue } from "./text-queue.js";
import GetTextToSpeech from "../text-to-speech/index.js";

const tts = GetTextToSpeech({
    voice: "Brian"
});

const varExample = {
    value : 0
}

const queue = GetTextQueue(tts, varExample);



