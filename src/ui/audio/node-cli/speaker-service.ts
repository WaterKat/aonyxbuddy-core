import stream from 'stream';
import Speaker from 'speaker';
import { ILogger, IService } from "../../../types.js";

export interface TSpeakerServiceOptions {
  logger?: ILogger;
}

export class SpeakerService implements IService<TSpeakerServiceOptions> {
  options?: TSpeakerServiceOptions = undefined;
  speaker: Speaker;

  constructor() {
    this.speaker = new Speaker({
      channels: 2,
      bitDepth: 16,
      sampleRate: 44100,
    });
    process.stdin.pipe(this.speaker);
  }

  Start(options: TSpeakerServiceOptions): void {
    this.options = options;
  }

  Stop() {
    this.speaker.close(true);
  }

  Restart() {
    this.Stop();
    if (!this.options) return;
    this.Start(this.options); 
  }

  Play(buffer: Buffer) {
    process.stdin.write(buffer);
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(this.speaker);
  }
}

