/**
 * Will receive an audio buffer and normalize it to the loudest point in the buffer
 * @param audioBuffer the audio buffer you wish to normalize the audio of
 * @param audioContext optional, assigning an audio context here prevents the creation of a new audio context (try to provide yours)
 * @returns the normalized audio buffer based on the loudest point in the audio buffer
 */
export function NormalizeAudioBuffer(audioBuffer: AudioBuffer, audioContext?: AudioContext) : AudioBuffer {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const newAudioBuffer = (audioContext ?? new AudioContext()).createBuffer(numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);

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
