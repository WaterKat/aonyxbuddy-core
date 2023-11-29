/**
 * Creates a new audio buffer source node that uses a provided audio buffer as its source
 * @param audioBuffer the audio buffer to use as a source for the new audio buffer source node
 * @param audioContext not required but recommended, the audio context used to create the buffer source node, providing one prevents the creation of a new one
 * @param audioAnalyzerNode not required but recommended, the destination analyzer node for the new audio buffer source node
 * @returns 
 */
export function GetAudioBufferSourceNode(audioBuffer: AudioBuffer, audioContext?: AudioContext, audioAnalyzerNode?: AnalyserNode): AudioBufferSourceNode {
    const context = audioContext ?? new AudioContext();
    const analyzer = audioAnalyzerNode ?? (() => {
        const node = context.createAnalyser();
        node.connect(context.destination);
        return node;
    })();

    const audioBufferSourceNode = context.createBufferSource();
    audioBufferSourceNode.buffer = audioBuffer;
    audioBufferSourceNode.connect(analyzer);
    return audioBufferSourceNode;
}

export function PlayAudioBufferSourceNode(audioContext: AudioContext, audioBufferSourceNode: AudioBufferSourceNode, onStopCallback?: () => void): void {
    audioBufferSourceNode.start();
    UnPause();
    function UnPause() {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
            setTimeout(UnPause, 100);
        } else {
            WaitForStop();
        }
    }
    function WaitForStop() {
        if (onStopCallback)
            audioBufferSourceNode.addEventListener('ended', onStopCallback);
    }
}

export function StopAudioBufferSourceNode(audioBufferSourceNode: AudioBufferSourceNode): undefined {
    audioBufferSourceNode.stop();
}

export function GetAudioBufferAmplitude(audioAnalyzerNode: AnalyserNode): number {
    const byteData = new Uint8Array(audioAnalyzerNode.fftSize / 2);
    audioAnalyzerNode.getByteTimeDomainData(byteData);
    
    // Convert byte data to centered float ranging from -1 to 1.
    const floatData = Array.from(byteData).map(n => (n - 128) / 128);
    
    // Calculate Peak Amplitude
    const peak = Math.max(...floatData.map(Math.abs));

    return peak;
}
