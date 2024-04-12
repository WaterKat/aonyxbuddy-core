import { StreamElementsVoiceID } from "./types.js";
//import Log from "../../log.js";

/**
 * 
 * @param text the text to be be generated as speech
 * @param voiceID the voice identifier for stream elements, will change the
 * voice model used to speak the text
 * @param audioContext optional, assigning an audio context here prevents the
 * creation of a new audio context (try to provide yours)
 * @returns the audio buffer that speaks the text given, or undefined if the
 * request failed
 */
export async function GetVoiceAudioBuffer(
    text: string, voiceID: StreamElementsVoiceID, audioContext?: AudioContext
): Promise<AudioBuffer | undefined> {
    // if the text is empty, don't bother
    if (!text || text.length < 1) {
        Log(
            'warn',
            'empty text provided to text to speech buffer request, ignoring...'
        );
        return;
    }

    // the uri to the stream elements api for text to speech generation
    const url: string =
        `https://api.streamelements.com/kappa/v2/speech` +
        `?voice=${voiceID}&text=${encodeURIComponent(text.trim())}`;

    try {
        // fetch the resources from the api and extract the audio buffer
        const response: Response = await fetch(url);
        const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
        const audioBuffer: AudioBuffer =
            await (audioContext ?? new AudioContext())
                .decodeAudioData(arrayBuffer);
        const normalizedBuffer: AudioBuffer =
            NormalizeAudioBuffer(audioBuffer, audioContext);
        return normalizedBuffer;
    } catch (e) {
        // on failure return undefined but log the error
        Log('warn', `text to speech buffer request failed for ${text}: `, e);
        return undefined;
    }
}

/**
 * Will receive an audio buffer and normalize it to the loudest point in the
 * buffer
 * @param audioBuffer the audio buffer you wish to normalize the audio of
 * @param audioContext optional, assigning an audio context here prevents the
 * creation of a new audio context (try to provide yours)
 * @returns the normalized audio buffer based on the loudest point in the audio
 * buffer
 */
export function NormalizeAudioBuffer(
    audioBuffer: AudioBuffer, audioContext?: AudioContext
): AudioBuffer {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const newAudioBuffer = (audioContext ?? new AudioContext())
        .createBuffer(
            numberOfChannels, audioBuffer.length, audioBuffer.sampleRate
        );

    for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        let maxVal = 0;

        // Find the maximum value
        for (let i = 0; i < channelData.length; i++) {
            const absoluteValue = Math.abs(channelData[i]);
            if (absoluteValue > maxVal) {
                maxVal = absoluteValue;
            }
        }

        // Normalize the buffer
        const gain = 1 / maxVal;
        const newChannelData = newAudioBuffer.getChannelData(channel);
        for (let i = 0; i < channelData.length; i++) {

            newChannelData[i] = channelData[i] * gain;
        }
    }

    return newAudioBuffer;
}
