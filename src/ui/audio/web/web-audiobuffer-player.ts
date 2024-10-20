import {
  IAudioBufferPlayer,
  TAudioBufferPlayerOptions,
  TAudioMutableState,
} from "../audio-types";

export type TWebAudioBufferPlayerOptions = TAudioBufferPlayerOptions;

export class WebAudioBufferPlayer implements IAudioBufferPlayer {
  options: TWebAudioBufferPlayerOptions;
  ctx: AudioContext;
  analyser: AnalyserNode;
  audioBuffer: Promise<AudioBuffer>;
  sourceNode?: AudioBufferSourceNode = undefined;

  constructor(options: TWebAudioBufferPlayerOptions) {
    this.options = options;
    this.ctx = new AudioContext();
    this.analyser = this.ctx.createAnalyser();
    this.audioBuffer = this.ctx.decodeAudioData(options.arrayBuffer);
  }

  play(): void {
    this.audioBuffer
      .then((audioBuffer) => {
        this.sourceNode = this.ctx.createBufferSource();
        this.sourceNode.buffer = audioBuffer;
        this.sourceNode.connect(this.analyser);
        this.sourceNode.start();
        this.sourceNode.onended = () => {
          this.options.onend?.();
        };
      })
      .catch((error) => {
        if (this.options.logger) this.options.logger.error(error);
        this.options.onend?.();
      });
  }

  getAmplitude(): number {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);
    const sum = dataArray.reduce((acc, value) => acc + value, 0);
    return sum / bufferLength;
  }

  stop(): void {
    this.sourceNode?.stop();
  }
}

/*
export function WebPlayAudioBuffer(buffer: ArrayBuffer) {
  return new Promise<void>((resolve, reject) => {
    const audioContext = new AudioContext();
    const source = audioContext.createBufferSource();
    audioContext.decodeAudioData(
      buffer,
      (audioBuffer) => {
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        source.onended = () => {
          resolve();
        };
      },
      reject
    );
  });
}
*/

export function WebAudioBufferPlayerAsPromise(
  options: TWebAudioBufferPlayerOptions,
  mutableState?: TAudioMutableState
) {
  return new Promise<void>((resolve) => {
    let amplitudeCheckInterval: ReturnType<typeof setInterval> | undefined =
      undefined;
    const modifiedOptions = {
      ...options,
      autoclose: true,
      onend: () => {
        if (mutableState) {
          mutableState.playing = false;
          mutableState.amplitude = 0;
        }
        options.onend?.();
        if (amplitudeCheckInterval) clearInterval(amplitudeCheckInterval);
        resolve();
      },
    };
    const player = new WebAudioBufferPlayer(modifiedOptions);
    player.play();

    if (mutableState) {
      mutableState.playing = true;
      amplitudeCheckInterval = setInterval(() => {
        mutableState.amplitude = player.getAmplitude();
      }, mutableState.amplitudeCheckInterval).unref();
    }
  });
}
