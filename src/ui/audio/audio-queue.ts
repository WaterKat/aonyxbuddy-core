/** The interval from which to check is audio context is not suspended */
const DefaultAudioSuspensionInterval = 500;

/** Options for the CreateAudioQueue function */
export type AudioQueueOptions = {
    context?: AudioContext,
    analyzer?: AnalyserNode,
    fftSize?: number,
    suspensionInterval?: number
};

/** 
 * The audio queue interface, the return type of CreateAudioQueue 
 * @property context the audio context used for the audio queue
 * @property analyzer the analyzer node used for the audio queue
 * @property sourceNodes the source nodes used for the audio queue
 * @method QueueAudio queues an audio buffer to the audio queue, does not play
 * @method PlayQueue plays the audio queue in order
 * @method StopAndClearQueue stops and clears the audio queue
 * */
export type AudioQueue = {
    context: AudioContext,
    analyzer: AnalyserNode,
    sourceNodes: Promise<AudioBufferSourceNode>[],
    QueueAudioBuffer: (audioBuffer: AudioBuffer | Promise<AudioBuffer>) =>
        void,
    PlayQueue: () => Promise<void>,
    StopAndClearQueue: () => void,
    GetAmplitude: () => number,
    GetFrequencyData: (
        length?: number,
        logScale?: boolean,
        freqBinMax?: number
    ) => number[]
};

/**
 * Will create an audio queue that can be used to queue and play audio buffers
 * @param options the options for the audio queue
 * @returns a promise that resolves to an audio queue
 */
export async function CreateAudioQueue(
    options?: AudioQueueOptions
): Promise<AudioQueue> {

    /** create audio context if not provided */
    const context = options?.context ?? new AudioContext();
    const analyzer = options?.analyzer ?? context.createAnalyser();
    analyzer.fftSize = options?.fftSize ?? 2048;
    analyzer.connect(context.destination);

    /** create empty audio to trigger audio suspension*/
    const emptyBuffer = context.createBuffer(1, 1, context.sampleRate);
    const emptySourceNode = context.createBufferSource();
    emptySourceNode.buffer = emptyBuffer;
    emptySourceNode.connect(analyzer);
    emptySourceNode.start();

    /** wait for audio context to be running */
    await new Promise<void>((resolve) => {
        setInterval(() => {
            context.resume();
            if (context.state !== "suspended") {
                resolve();
            }
        }, options?.suspensionInterval ?? DefaultAudioSuspensionInterval)
    });
    emptySourceNode.disconnect();

    /** working audio queue */
    const sourceNodes: Promise<AudioBufferSourceNode>[] = [];

    /** audio queue object */
    const audioQueue: AudioQueue = {
        context,
        analyzer,
        sourceNodes,
        QueueAudioBuffer(audioBuffer: AudioBuffer | Promise<AudioBuffer>) {
            if (audioBuffer instanceof Promise) {
                sourceNodes.push(
                    audioBuffer.then((buffer) => {
                        const audioBufferSourceNode = context
                            .createBufferSource();
                        audioBufferSourceNode.buffer = buffer;
                        audioBufferSourceNode.connect(analyzer);
                        return audioBufferSourceNode;
                    })
                );
            } else {
                const audioBufferSourceNode = context.createBufferSource();
                audioBufferSourceNode.buffer = audioBuffer;
                audioBufferSourceNode.connect(analyzer);
                sourceNodes.push(new Promise<AudioBufferSourceNode>(
                    (resolve) => resolve(audioBufferSourceNode)
                ));
            }
        },
        async PlayQueue() {
            while (sourceNodes.length > 0) {
                try {
                    const sourceNode = await sourceNodes[0]
                    await new Promise<void>((resolve) => {
                        sourceNode.start();
                        sourceNode.addEventListener("ended", () => {
                            resolve();
                        });
                    });
                } catch (error) {
                    console.error(error);
                }
                sourceNodes.shift();
            }
        },
        StopAndClearQueue() {
            while (sourceNodes.length > 0) {
                sourceNodes.pop()?.then((sourceNode) => sourceNode.stop());
            }
        },
        GetAmplitude() {
            if (sourceNodes.length < 1) return 0;
            const byteData = new Uint8Array(analyzer.fftSize / 2);
            analyzer.getByteTimeDomainData(byteData);
            const peak = byteData.reduce((a, b) => {
                const a_abs = Math.abs(a - 128);
                return a_abs > b ? a_abs : b;
            }, 0) / 128;
            return peak;
        },
        GetFrequencyData(
            length?: number,
            logScale: boolean = false,
            freqBinMax?: number
        ) {
            if (!length) {
                const byteData = new Uint8Array(analyzer.frequencyBinCount);
                analyzer.getByteFrequencyData(byteData);
                const data = new Array<number>(byteData.length);
                for (let i = 0; i < byteData.length; i++) {
                    data[i] = byteData[i] / 255;
                }
                return data
            }

            if (length < 1 || isNaN(length) || !isFinite(length)) return [];

            const byteData = new Uint8Array(analyzer.frequencyBinCount);
            const byteDataLength = Math.min(
                freqBinMax ?? byteData.length,
                byteData.length
            );

            analyzer.getByteFrequencyData(byteData);

            const data: number[] = new Array<number>(length);
            for (let i = 0; i < length; i++) {
                let low = 0;
                if (logScale) {
                    low = Math.sqrt(i / length) * (
                        byteDataLength
                    );
                } else {
                    low = i * byteDataLength / length;
                }
                low = Math.max(Math.floor(low), 0);

                let high = 0;
                if (logScale) {
                    high = Math.sqrt((i + 1) / length) * byteDataLength;
                } else {
                    high = (i + 1) * byteDataLength / length;
                }
                high = Math.min(Math.floor(high), byteDataLength);

                data[i] = byteData.slice(low, high)
                    .reduce((a, b) => a + b, 0);
                data[i] /= (high - low) * 256;
            }
            return data;
        }
    };

    return audioQueue;
}
