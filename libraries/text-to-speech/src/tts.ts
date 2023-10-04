import { Types } from "./index.ts";
import { GetVoiceAudioBuffer } from "./resources/index.ts";
import { GetAudioBufferSourceNode, PlayAudioBufferSourceNode, StopAudioBufferSourceNode } from "./audio/audio-buffer-source-node.ts";

export function GetTextToSpeech(config: Types.ITextToSpeechConfig) {
    const context = new AudioContext();
    const analyzer = context.createAnalyser();
    const sourceNodes : AudioBufferSourceNode[] = [];
    analyzer.connect(context.destination);
    return {
        context: context,
        analyzer: analyzer,
        Speak: async (text: string, onStop?: () => void) => {
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
    }
}