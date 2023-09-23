import { Types } from "../index.js";
import { NormalizeAudioBuffer } from "./normalize-audio-buffer.js";

export async function GetVoiceAudioBuffer(text: string, voiceID: Types.StreamElementsVoiceID, audioContext?: AudioContext) : Promise<AudioBuffer | undefined> {
    if (!text || text.length < 1)
        return;

    const url: string =
        `https://api.streamelements.com/kappa/v2/speech?voice=${voiceID}&text=${encodeURIComponent(text.trim())}`;

    const response: Response = await fetch(url);
    const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
    const audioBuffer: AudioBuffer = await (audioContext ?? new AudioContext()).decodeAudioData(arrayBuffer);
    const normalizedBuffer: AudioBuffer = NormalizeAudioBuffer(audioBuffer, audioContext);
    return normalizedBuffer;
}