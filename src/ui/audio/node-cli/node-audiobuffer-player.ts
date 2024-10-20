import Speaker from "speaker";
import { Decoder } from "lame";
import stream from "stream";
//import { ILogger } from "../../../types";
import {
  IAudioBufferPlayer,
  TAudioBufferPlayerOptions,
  TAudioMutableState,
} from "../audio-types";

/*
export type TPlayAudioBufferOptions = {
  amplitude: number;
  interval: number;
};

export function NodePlayAudioBuffer(
  buffer: ArrayBuffer,
  options?: TPlayAudioBufferOptions
): Promise<void> {
  let startTime = Date.now();

  return new Promise<void>((resolve, reject) => {
    const decoder = Decoder({
      decoder: "mp3",
      autoDestroy: true,
    });
    decoder.on("error", reject);
    decoder.on(
      "format",
      (format: {
        raw_encoding: number; // unkown
        sampleRate: number; // 44100
        channels: number; // 2
        signed: boolean; // true
        float: boolean; // false
        ulaw: boolean; // false
        alaw: boolean; // false
        bitDepth: number; // 16
      }) => {
        console.log("format", format);

        const speaker = new Speaker({
          channels: format.channels,
          bitDepth: format.bitDepth,
          sampleRate: format.sampleRate,
        });

        speaker.on("error", reject);

        //      decoder.pipe(speaker, { end: true });

        //? ANALYZE AMPLITUDE
        let buff = Buffer.alloc(0);
        const bufferStream = new stream.PassThrough().on("data", (chunk) => {
          buff = Buffer.concat([buff, chunk]);
        });

        decoder.pipe(bufferStream, { end: true }).pipe(speaker, { end: true });

        console.log("options", options);

        let i = 0;
        const interval = setInterval(() => {
          console.log("i", i, Date.now() - startTime);
          i += 1;
          /*
          if (i >= buff.length) {
            if (options) options.amplitude = 0;
            console.log("i >= buff.length");
            return;
          } else {
            console.log("i < buff.length");
          }
          const increment =
            format.sampleRate * (options?.interval ?? 1000 / 10000);
          const chunk = buffer.slice(i, i + increment);
          const amp =
            new Uint8Array(chunk).reduce((acc, val) => acc + val, 0) /
            chunk.byteLength;
          if (options) options.amplitude = amp;
          i += increment;
          console.log("amplitude", amp);
          */ /*
        }, options?.interval ?? 1000);
        // END ANALYZE AMPLITUDE

        speaker.on("close", () => {
          if (options) options.amplitude = 0;
          if (interval) clearInterval(interval);
          console.info("speaker close");
          resolve();
        });
      }
    );
    decoder.end(Buffer.from(buffer));
    */ /*
    const speaker = new Speaker({
      channels: 2,
      bitDepth: 16,
      sampleRate: sampleRate,
    });
    speaker.on("error", reject);

    const buff = Buffer.alloc(0);
    
    const bufferStream = new stream.PassThrough().on("data", (chunk) => {
      buff.join(chunk);
    });

    let i = 0;
    const interval = setInterval(() => {
      if (i >= buff.length) return;
      const increment = sampleRate / (options?.interval ?? 1000);
      const chunk = buff.subarray(i, i + increment);
      const amp = chunk.reduce((acc, val) => acc + val, 0) / chunk.length;
      if (options) options.amplitude = amp;
      i += increment;
    }, options?.interval ?? 1000).unref();

    decoder.pipe(speaker, { end: true })
    decoder.pipe(bufferStream, { end: true });

    decoder.end(Buffer.from(buffer));

    speaker.on("close", () => {
      if (interval) clearInterval(interval);
      if (options) options.amplitude = 0;
      resolve();
    });
    */ /*
  });
}
*/

type TFormat = {
  raw_encoding: number; // unkown
  sampleRate: number; // 44100
  channels: number; // 2
  signed: boolean; // true
  float: boolean; // false
  ulaw: boolean; // false
  alaw: boolean; // false
  bitDepth: number; // 16
};

/*
export type TNodeAudioBufferPlayerOptions = {
  audioBuffer: ArrayBuffer;
  onend?: () => void;
  logger?: ILogger;
  autoClose?: boolean;
};
*/
export type TNodeAudioBufferPlayerOptions = TAudioBufferPlayerOptions;

export class NodeAudioBufferPlayer implements IAudioBufferPlayer {
  options: TNodeAudioBufferPlayerOptions;
  decoder: ReturnType<typeof Decoder>;
  pcmBuffer = Buffer.alloc(0);
  format?: TFormat = undefined;
  speaker?: Speaker = undefined;
  startTime?: Date = undefined;

  constructor(options: TNodeAudioBufferPlayerOptions) {
    this.options = options;
    this.decoder = Decoder({
      decoder: "mp3",
    });
    this.decoder.on("error", (error) => {
      if (this.options.logger) this.options.logger.error(error);
    });
    this.decoder.on("format", (format: TFormat) => {
      if (this.options.logger) this.options.logger.info("format", format);

      this.startTime = new Date();

      this.speaker = new Speaker({
        channels: format.channels,
        bitDepth: format.bitDepth,
        sampleRate: format.sampleRate,
      });

      this.speaker.on("error", (error) => {
        if (this.options.logger) this.options.logger.error(error);
      });

      this.speaker.on("close", () => {
        if (this.options.logger) this.options.logger.info("speaker close");
        this.options.onend?.();
        if (this.options.autoClose) this.stop();
      });

      const bufferExtractor = new stream.PassThrough();
      bufferExtractor.on("data", (chunk) => {
        this.pcmBuffer = Buffer.concat([this.pcmBuffer, chunk]);
      });

      this.decoder
        .pipe(bufferExtractor, { end: true })
        .pipe(this.speaker, { end: true });
    });
  }

  play() {
    if (this.options) {
      this.decoder.end(Buffer.from(this.options.arrayBuffer));
    }
  }

  getAmplitude(intervalMS: number): number {
    if (!this.startTime) return 0;
    if (!this.format) return 0;
    if (!this.pcmBuffer) return 0;
    const timeSinceStartMS = new Date().getTime() - this.startTime.getTime();
    const startSample = this.format.sampleRate * (timeSinceStartMS / 1000);
    const sampleRegion = this.format.sampleRate * (intervalMS / 1000);
    const bufferSlice = this.pcmBuffer.subarray(
      startSample,
      startSample + sampleRegion
    );
    const amplitudeMax = bufferSlice.reduce(
      (acc, val) => (acc > val ? acc : val),
      0
    );
    return amplitudeMax;
  }

  stop() {
    this.decoder.close();
    this.decoder.destroy();
    if (this.speaker) {
      this.speaker.close(false);
      this.speaker.destroy();
    }
  }
}

export function NodeAudioBufferPlayerAsPromise(
  options: TNodeAudioBufferPlayerOptions,
  mutableState?: TAudioMutableState
) {
  return new Promise<void>((resolve) => {
    let amplitudeCheckInterval: ReturnType<typeof setInterval> | undefined =
      undefined;
    const modifiedOptions = {
      ...options,
      autoClose: true,
      onend: () => {
        if (mutableState) {
          mutableState.playing = false;
        }
        if (amplitudeCheckInterval) clearInterval(amplitudeCheckInterval);
        resolve();
      },
    }
    const player = new NodeAudioBufferPlayer(modifiedOptions);
    player.play();

    if (mutableState) {
      mutableState.playing = true;
      amplitudeCheckInterval = setInterval(() => {
        mutableState.amplitude = player.getAmplitude(mutableState.amplitudeCheckInterval);
      }, mutableState.amplitudeCheckInterval);
    }
  });
}
