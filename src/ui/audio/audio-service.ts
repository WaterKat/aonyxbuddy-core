import { ILogger } from "../../types.js";

import {
  IAudioBufferPlayer,
  TAudioBufferPlayerOptions,
} from "./audio-types.js";

import { TPopulatedAudioBufferData } from "./text-to-speech.js";

export type TAudioServiceOptions = {
  playerConstructor: (options: TAudioBufferPlayerOptions) => IAudioBufferPlayer;
  logger?: ILogger;
};

export class AudioService {
  options: TAudioServiceOptions;
  queue: TPopulatedAudioBufferData[] = [];
  currentPlayer?: IAudioBufferPlayer = undefined;
  constructor(options: TAudioServiceOptions) {
    this.options = options;
  }

  Queue(...data: TPopulatedAudioBufferData[]) {
    this.queue.push(...data);
  }

  async PlayQueue(): Promise<void> {
    const buffer = this.queue.shift();

    if (!buffer) {
      this.options.logger?.info("AudioService: Queue is empty");
      return;
    }

    await new Promise<void>((resolve) => {
      const playerOptions: TAudioBufferPlayerOptions = {
        arrayBuffer: buffer.arrayBuffer,
        logger: this.options.logger,
        onend: () => resolve(),
      };
      this.currentPlayer = this.options.playerConstructor(playerOptions);
    });

    return this.PlayQueue();
  }

  GetAmplitude(intervalMS?: number): number {
    return this.currentPlayer?.getAmplitude(intervalMS ?? 1000 / 24) ?? 0;
  }

  StopAndClearQueue(): void {
    this.queue = [];
    this.currentPlayer?.stop();
  }
}
