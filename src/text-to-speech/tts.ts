import { GetVoiceAudioBuffer } from "./resources/index.js";
import { GetAudioBufferSourceNode, PlayAudioBufferSourceNode, StopAudioBufferSourceNode } from "./audio/audio-buffer-source-node.js";
import { ITextToSpeechWrapper, ITextToSpeechOptions } from "./types.js";

export function GetTextToSpeech(config: ITextToSpeechOptions) : ITextToSpeechWrapper {
    const context = new AudioContext();
    const analyzer = context.createAnalyser();
    const sourceNodes : AudioBufferSourceNode[] = [];

    analyzer.connect(context.destination);
    
    const wrapper : ITextToSpeechWrapper= {
        context: context,
        analyzer: analyzer,
        Speak: async (text: string, onStop?: () => void) => {
            //* If Empty text then just run callback, ignore the rest
            if (text.trim().length < 1) {
                if (onStop){
                    onStop();
                }
                return;
            }

            const audioBuffer = await GetVoiceAudioBuffer(text, config.voice, context);
            if (!audioBuffer) return;
            const audioBufferSourceNode = GetAudioBufferSourceNode(audioBuffer, context, analyzer);
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