
export function NormalizeAudioBuffer(audioBuffer: AudioBuffer, audioContext?: AudioContext) : AudioBuffer {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const newAudioBuffer = (audioContext ?? new AudioContext()).createBuffer(numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);

    for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        let maxVal = 0;

        // Find the maximum value
        for (let i = 0; i < channelData.length; i++) {
            if (Math.abs(channelData[i]) > maxVal) {
                maxVal = Math.abs(channelData[i]);
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
