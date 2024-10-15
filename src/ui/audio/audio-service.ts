import { IService, ILogger } from "../../types.js";

export type TAudioServiceOptions = {
  logger: ILogger;
  fftSize?: number;
};

export class AudioService implements IService<TAudioServiceOptions> {
  options: TAudioServiceOptions;
  context: AudioContext;
  analyzer: AnalyserNode;
  emptyBuffer: AudioBuffer;
  state: "running" | "suspended" = "suspended";

  constructor() {
    this.options = { logger: console };
    this.context = new AudioContext();
    this.analyzer = this.context.createAnalyser();
    this.analyzer.fftSize = 2048;
    this.analyzer.connect(this.context.destination);
    this.emptyBuffer = this.context.createBuffer(1, 1, this.context.sampleRate);
  }

  Start(options: TAudioServiceOptions): void {
    if (this.context.state == "suspended") this.context.resume();

    //? Assign the options to the service
    this.options = options;
    this.analyzer.fftSize = options.fftSize ?? this.analyzer.fftSize;

    //? Create empty audio to trigger audio suspension
    const emptySourceNode = this.context.createBufferSource();
    emptySourceNode.buffer = this.emptyBuffer;
    emptySourceNode.connect(this.analyzer);

    //? Wait for audio context to be running
    const suspendedCheckInterval = setInterval(() => {
      this.context.resume();
      if (this.context.state !== "suspended") {
        this.state = "running";
        clearInterval(suspendedCheckInterval);
      }
    }, 100).unref();
  }
  Stop(): void {
    if (this.context.state == "running") this.context.suspend();
    this.state = "suspended";
  }
  Restart(): void {
    this.Stop();
    if (!this.options) return;
    this.Start(this.options);
  }
}
