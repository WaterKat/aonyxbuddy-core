//import { ITextToSpeechOptions } from "./ioptions";
import { ITextToSpeech } from './itext-to-speech';
//import { Config, ConfigComponents } from "../config";

export interface IStreamElementsTTSOptions {
    voice:
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
    'Amy'
}

export class StreamElementsTTS implements ITextToSpeech {
    private audioContext: AudioContext = new AudioContext();

    private amplitudeUpdateInterval = 1000 / 30;
    private isPlaying: boolean = false;
    private amplitude: number = 0;
    private relativeMaxAmplitude: number = 0;
    
    private voiceID: string; //Default: 'Brian'
    private audioAnalyzerNode: AnalyserNode;
    private audioBufferSourceNode : AudioBufferSourceNode | undefined;

    constructor(options: IStreamElementsTTSOptions) {
        this.voiceID = options.voice;
        this.audioAnalyzerNode = this.audioContext.createAnalyser();
        this.audioAnalyzerNode.connect(this.audioContext.destination);
    }

    IsPlaying(): boolean {
        return this.isPlaying;
    }

    GetAmplitude(): number {
        return this.amplitude;
    }

    async Speak(text: string) {
        if (!text || text.length < 1)
            return;
            
        const url: string =
            `https://api.streamelements.com/kappa/v2/speech?voice=${this.voiceID}&text=${encodeURIComponent(text.trim())}`;

        const response: Response = await fetch(url);
        const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
        const audioBuffer: AudioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

        const audioBufferSourceNode = this.audioContext.createBufferSource();
        this.audioBufferSourceNode = audioBufferSourceNode;
        audioBufferSourceNode.buffer = audioBuffer;
        audioBufferSourceNode.connect(this.audioAnalyzerNode);

        this.isPlaying = true;
        audioBufferSourceNode.start();

        while (this.audioContext.state === 'suspended') {
            await new Promise(resolve => setTimeout(resolve, 100));
            this.audioContext.resume();
        }

        const loop: ReturnType<typeof setInterval> = setInterval(() => {
            const rawAmplitude = StreamElementsTTS.GetAmplitude(this.audioAnalyzerNode)
            this.relativeMaxAmplitude = Math.max(rawAmplitude, this.relativeMaxAmplitude);
            this.amplitude = rawAmplitude / this.relativeMaxAmplitude;
            if (isNaN(this.amplitude)) this.amplitude = 0;
        }, this.amplitudeUpdateInterval);

        await new Promise<void>(resolve => {
            audioBufferSourceNode.addEventListener('ended', () => {
                clearInterval(loop);
                this.amplitude = 0;
                this.relativeMaxAmplitude = 0;
                this.isPlaying = false;
                resolve();
            });
        });
    }

    Interrupt() {
        this.audioBufferSourceNode?.stop();
    }

    private static GetAmplitude(node: AnalyserNode) {
        const byteData = new Uint8Array(node.fftSize / 2);
        node.getByteTimeDomainData(byteData);

        // Convert byte data to centered float ranging from -1 to 1.
        const floatData = Array.from(byteData).map(n => (n - 128) / 128);

        // Calculate RMS.

        const rms = Math.sqrt(
            floatData.reduce((sum, val) => sum + (val * val), 0) / floatData.length
        );

        return rms;
    }
}
