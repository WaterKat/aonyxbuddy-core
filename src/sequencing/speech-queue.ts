import { IRendererParam } from "../sprite-rendering/types.js";
import * as TextToSpeech from "../text-to-speech/index.js";
import { ITextToSpeechWrapper } from "../text-to-speech/index.js";
import { Logger } from "../log.js";

export function GetSpeechQueue(tts: ITextToSpeechWrapper, talkingRendererParam: IRendererParam) {
    //* Text To Speech Queue Logic
    const speechQueue: { text: string, callback?: () => void }[] = [];
    const timeBetweenSpeech = 0.25;
    let isSpeakingQueue = false;


    function AppendToSpeechQueue(text: string, callback?: () => void) {
        speechQueue.push({ text: text, callback: callback });
    }
    function InsertToSpeechQueue(text: string, callback?: () => void) {
        speechQueue.splice(0, 0, { text: text, callback: callback });
    }

    function StopSpeaking(): boolean {
        if (isSpeakingQueue) {
            tts.Stop();
            isSpeakingQueue = false;
            return true;
        }
        return false;
    }

    function SpeakInQueue() {
        if (isSpeakingQueue) return;
        isSpeakingQueue = true;

        function SpeakRequest() {
            if (!isSpeakingQueue) return;

            if (speechQueue.length < 1) {
                isSpeakingQueue = false;
                return;
            }

            const speechRequest = speechQueue.shift();
            if (!speechRequest) return;

            Logger.info('Speech Request:', speechRequest.text);

            const interval = setInterval(() => {
                const amplitude = TextToSpeech.Audio.GetAudioBufferAmplitude(tts.analyzer);
                talkingRendererParam.value = talkingRendererParam.min + ((talkingRendererParam.max - talkingRendererParam.min) * amplitude);
            }, 1000 / 60);

            tts.Speak(speechRequest.text, () => {
                clearInterval(interval);
                talkingRendererParam.value = talkingRendererParam.min;
                if (speechRequest.callback) speechRequest.callback();
                SpeakRequest();
            });

        }

        setTimeout(SpeakRequest, 1000 * timeBetweenSpeech);
    }
    
    return {
        speechQueue,
        AppendToSpeechQueue,
        InsertToSpeechQueue,
        StopSpeaking,
        SpeakInQueue,
    }
}