import { GetStreamElementsVoiceAudioBuffer } from "../audio/fetch-buffer.js";
import {
    GetAudioBufferAmplitude,
    GetAudioBufferSourceNode,
    PlayAudioBufferSourceNode,
    StopAudioBufferSourceNode
} from "./audio-buffer-source-node.js";

import {
    StreamElementsVoiceID,
    DefaultStreamElementsVoiceID
} from "../audio/fetch-buffer.js";

/** an options interface for use with TextToSpeech */
export interface ITextToSpeechOptions {
    voice?: StreamElementsVoiceID
    context?: AudioContext
}

/** 
 * The object interface of a TextToSpeech service within aonyxbuddy, similar
 * to a class
 */
export type ITextToSpeechWrapper = {
    context: AudioContext,
    analyzer: AnalyserNode,
    configuration: ITextToSpeechOptions,
    GetAmplitude: () => number,
    Speak: (text: string, onStop?: () => void) =>
        Promise<AudioBufferSourceNode | undefined>,
    Stop: () => void
}

/**
 * Provides a wrapper for text to speech functions, specifically starting and
 * stopping speech
 * @param options the configuration used to select voice type and other
 * configuration
 * @returns the wrapper for the text to speech function, used to start and stop
 * speech
 */
export function CreateTextToSpeech(
    options: ITextToSpeechOptions
): ITextToSpeechWrapper {
    const context = options.context ?? new AudioContext();
    const analyzer = context.createAnalyser();
    const sourceNodes: AudioBufferSourceNode[] = [];

    analyzer.connect(context.destination);

    const wrapper: ITextToSpeechWrapper = {
        context: context,
        analyzer: analyzer,
        configuration: {
            voice: options.voice ?? DefaultStreamElementsVoiceID,
            context: context
        },
        GetAmplitude: () => GetAudioBufferAmplitude(analyzer),
        Speak: async (text: string, onStop?: () => void) => {
            //* If Empty text then just run callback, ignore the rest
            if (text.trim().length < 1) {
                if (onStop) {
                    onStop();
                }
                return undefined;
            }

            const audioBuffer = await GetStreamElementsVoiceAudioBuffer(
                context, text, options.voice,
            );
            if (!audioBuffer) return;
            const audioBufferSourceNode = GetAudioBufferSourceNode(
                audioBuffer, context, analyzer
            );
            sourceNodes.push(audioBufferSourceNode);
            PlayAudioBufferSourceNode(context, audioBufferSourceNode, onStop);
            return audioBufferSourceNode;
        },
        Stop: () => {
            while (sourceNodes.length > 0) {
                const sourceNode = sourceNodes.pop();
                if (!sourceNode) break;
                StopAudioBufferSourceNode(sourceNode);
            }
        }
    };

    return wrapper;
}
