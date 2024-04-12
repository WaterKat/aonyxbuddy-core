/** 
 * A string type that is a tested valid voice id for use with stream elements
 *  text to speech 
 */
export type StreamElementsVoiceID =
    'Salli' |
    'Matthew' |
    'Kimberly' |
    'Kendra' |
    'Justin' |
    'Joey' |
    'Joanna' |
    'Ivy' |
    'Emma' |
    'Brian' |
    'Amy';

const DefaultStreamElementsVoiceID: StreamElementsVoiceID = "Brian";

/**
 * Will generate an audio buffer that speaks the text given using the voice
 * model specified by the voiceID. The audio buffer will be normalized to the
 * loudest point in the buffer.
 * @param text the text to be be generated as speech
 * @param voiceID the voice identifier for stream elements
 * @param audioContext the audio context to use for decoding the audio buffer
 * @returns a normalized audio buffer that contains the speech of the text
 * provided. If the request fails, undefined will be returned instead.
 */
export async function GetVoiceAudioBuffer(
    audioContext: AudioContext,
    text: string,
    voiceID?: StreamElementsVoiceID
): Promise<AudioBuffer | undefined> {
    if (!text || text.length < 1) return undefined;

    const uri: string =
        `https://api.streamelements.com/kappa/v2/speech` +
        `?voice=${voiceID ?? DefaultStreamElementsVoiceID}` +
        `&text=${encodeURIComponent(text.trim())}`;

    try {
        const response: Response = await fetch(uri);
        const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
        const audioBuffer: AudioBuffer = await audioContext
            .decodeAudioData(arrayBuffer);
        const normalizedBuffer: AudioBuffer =
            NormalizeAudioBuffer(audioBuffer, audioContext);
        return normalizedBuffer;
    } catch (e) {
        console.warn(`text to speech buffer request failed for ${text}: `);
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
    audioBuffer: AudioBuffer, audioContext: AudioContext
): AudioBuffer {
    const newAudioBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
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
