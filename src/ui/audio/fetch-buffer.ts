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

export const DefaultStreamElementsVoiceID: StreamElementsVoiceID = "Brian";

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
export async function GetStreamElementsVoiceAudioBuffer(
    audioContext: AudioContext,
    text: string,
    voiceID: StreamElementsVoiceID = DefaultStreamElementsVoiceID,
    options: FilterAudioBufferOptions = {
        normalize: true,
        downmix_to_mono: true
    }
): Promise<AudioBuffer> {

    if (!text || text.length < 1) throw new Error("Text must be provided");

    const url: string =
        `https://api.streamelements.com/kappa/v2/speech` +
        `?voice=${voiceID}` +
        `&text=${encodeURIComponent(text.trim())}`;

    return GetAudioFromURL(audioContext, url, options);
}

/**
 * Will generate an audio buffer from a URL and normalize it to the loudest
 * point in the buffer
 * @param audioContext the audio context to use for decoding the audio buffer
 * @param url the url to the audio file
 * @param normalize optional, if true the audio buffer will be normalized to
 * the loudest point in the buffer
 * @returns the audio buffer from the URL provided
 */
export async function GetAudioFromURL(
    audioContext: AudioContext,
    url: string,
    options?: FilterAudioBufferOptions
): Promise<AudioBuffer> {
    const response: Response = await fetch(url);
    const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
    const audioBuffer: AudioBuffer = await audioContext
        .decodeAudioData(arrayBuffer);

    if (options) {
        return FilterAudioBuffer(audioContext, audioBuffer, options);
    }
    return audioBuffer;
}

/**
 * Options for FilterAudioBuffer
 * @param normalize if true, the audio buffer will be normalized to the loudest
 * point in the buffer
 * @param downmix_to_mono if true, the audio buffer will be downmixed to mono
 */
export type FilterAudioBufferOptions = {
    normalize?: boolean,
    downmix_to_mono?: boolean
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
export function FilterAudioBuffer(
    audioContext: AudioContext,
    audioBuffer: AudioBuffer,
    options?: FilterAudioBufferOptions
): AudioBuffer {
    if (!options) return audioBuffer;

    /**
     *  make channel data available 
     * ! NOTE: these are references to the original data, changes will affect
     * ! the original audio buffer
    */
    const channelData: Float32Array[] = [];
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        channelData.push(audioBuffer.getChannelData(channel));
    }

    /** get max amplitude for use with normalization */
    let maxAmplitude = 1;
    if (options.normalize) {
        maxAmplitude = 0;
        for (let c = 0; c < channelData.length; c++) {
            for (let i = 0; i < channelData[c].length; i++) {
                const amplitude = Math.abs(channelData[c][i]);
                if (amplitude > maxAmplitude) {
                    maxAmplitude = amplitude;
                }
            }
        }
    }
    const gain = options.normalize ? maxAmplitude / maxAmplitude : 1;

    /** create a new audio buffer */
    const newBuffer = audioContext.createBuffer(
        options.downmix_to_mono ? 1 : audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
    );

    const newChannelData: Float32Array[] = [];
    for (let channel = 0; channel < newBuffer.numberOfChannels; channel++) {
        newChannelData.push(newBuffer.getChannelData(channel));
    }

    /** assign new data to new buffer
     * normalize function is encoded to gain variable
     * downmix_to_mono is handled by the loop
    */
    for (let i = 0; i < channelData[0].length; i++) {
        for (let c = 0; c < channelData.length; c++) {
            if (options.downmix_to_mono) {
                newChannelData[0][i] +=
                    channelData[c][i] * gain / channelData.length;
            } else {
                newChannelData[c][i] = channelData[c][i] * gain;
            }
        }
    }

    return newBuffer;
}
