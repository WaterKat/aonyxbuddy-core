import { ILogger } from "../../types";

export type TAudioMutableState = {
  playing: boolean;
  amplitude: number;
  amplitudeCheckInterval: number;
}

export type TAudioBufferPlayerOptions = {
  arrayBuffer: ArrayBuffer;
  onend?: () => void;
  logger?: ILogger;
  autoClose?: boolean;
}

export interface IAudioBufferPlayer {
  play(): void;
  stop(): void;
  getAmplitude(intervalMS: number): number;
}
