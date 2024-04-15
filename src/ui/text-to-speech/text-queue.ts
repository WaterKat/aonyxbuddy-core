import { ITextToSpeechWrapper } from "./entry.js";
import { GetStreamElementsVoiceAudioBuffer } from "../audio/fetch-buffer.js";

export function GetTextQueue(tts: ITextToSpeechWrapper) {
    const queue: Promise<void>[] = [];


    return {
        queue,
        QueueSpeech(text: string, onStart?: () => void, onStop?: () => void) {
            const buffer = GetStreamElementsVoiceAudioBuffer(
                tts.context,
                text,
                tts.configuration.voice
            );

            const promise = new Promise<void>(async (resolve) => {
                if (onStart) onStart();
                await tts.Speak(text);
                if (onStop) onStop();
            });

            const speechPromise = tts.Speak(text);
            const
                queue.push(

                if(onStart) onStart();
                return promise.then(onStop);
        if(onStop) onStop();
    }));
},

    }
}

