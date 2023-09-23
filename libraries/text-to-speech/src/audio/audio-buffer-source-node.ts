
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

    // Calculate RMS.
    const rms = Math.sqrt(
        floatData.reduce((sum, val) => sum + (val * val), 0) / floatData.length
    );

    return rms;
}

