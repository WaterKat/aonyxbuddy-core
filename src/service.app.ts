import { ObjectContainsKey } from "./lib.js";
import { AonyxBuddyWebClient, TAonyxBuddyWebClientOptions } from "./service.js";
import { NodeAudioBufferPlayer } from "./ui/audio/node-cli/node-audiobuffer-player.js";
import {
  FetchAndPopulateBuffers,
  ParseTextToSpeechText,
  TTextToSpeechOptions,
} from "./ui/audio/text-to-speech.js";
import { WaitUntilInteracted } from "./ui/audio/web/wait-until-interacted.js";
import { WebAudioBufferPlayer } from "./ui/audio/web/web-audiobuffer-player.js";

await WaitUntilInteracted();

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const AonyxBuddyState : Record<string, any> = {
  eventCallback : (e: unknown) => {
    console.log("EventCallback", e);
  },
};

if (typeof window !== "undefined") {
  AonyxBuddyState.ctx = new AudioContext();
  AonyxBuddyState.analyser = AonyxBuddyState.ctx.createAnalyser();
  AonyxBuddyState.analyser.connect(AonyxBuddyState.ctx.destination);
  AonyxBuddyState.inputEmitter = window;
  AonyxBuddyState.soundPlayer = WebAudioBufferPlayer;
}else {
  AonyxBuddyState.inputEmitter = new EventTarget();
  AonyxBuddyState.soundPlayer = NodeAudioBufferPlayer;
}

const options: TAonyxBuddyWebClientOptions = {
  logger: console,
  streamEventService: {
    logger: console,
    callback: AonyxBuddyState.eventCallback,
    inputEmitter: AonyxBuddyState.inputEmitter,
  },
  streamElementsOptions: {
    logger: console,
    callback: AonyxBuddyState.eventCallback,
    inputEmitter: AonyxBuddyState.inputEmitter,
  },
  streamElementsSocketOptions: {
    logger: console,
    listenToTestEvents: true,
    getJWT: async () => {
      if (!ObjectContainsKey(import.meta, "env"))
        throw new Error("env not found");
      const token =
        (import.meta as unknown as { env: { [key: string]: string } }).env
          .VITE_SE_JWT ?? "";
      return token;
    },
    callback: AonyxBuddyState.eventCallback,
    outputEmitter: undefined,
  },
};

const client = new AonyxBuddyWebClient();
client.Start(options);

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    client.Stop();
  });
}
