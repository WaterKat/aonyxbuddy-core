import { GetSpeechQueue } from "../sequencing/speech-queue.js";
import { Logger } from "../log.js";

export function GetSpeechSkipping(speechQueueWrapper: ReturnType<typeof GetSpeechQueue>) {
    let skipCount = 0;

    function SkipSpeech(count?: number) {
        skipCount += count ?? 0;
        Logger.info('Skips Starting: ' + skipCount);

        if (skipCount < 1) return;

        if (speechQueueWrapper.StopSpeaking()) skipCount -= 1;

        while (skipCount > 0 && speechQueueWrapper.speechQueue.length > 0) {
            const skipped = speechQueueWrapper.speechQueue.pop();
            Logger.info('SkipSpeech ' + skipped?.text);
            skipCount -= 1;
        }

        Logger.info('Skips Left: ' + skipCount);
    }

    function SkipAllSpeech() {
        speechQueueWrapper.StopSpeaking();
        while (speechQueueWrapper.speechQueue.length > 0) {
            const skipped = speechQueueWrapper.speechQueue.pop();
            Logger.info('SkipAllSpeech ' + skipped?.text);
        }
    }

    return {
        skipCount,
        SkipSpeech,
        SkipAllSpeech
    }
}