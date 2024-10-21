import DefaultAonyxBuddyConfig from "./config/default-config.js";
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
const AonyxBuddyState: Record<string, any> = {
  eventCallback: (e: unknown) => {
    console.log("EventCallback", e);
  },
};

if (typeof window !== "undefined") {
  AonyxBuddyState.ctx = new AudioContext();
  AonyxBuddyState.analyser = AonyxBuddyState.ctx.createAnalyser();
  AonyxBuddyState.analyser.connect(AonyxBuddyState.ctx.destination);
  AonyxBuddyState.inputEmitter = window;
  AonyxBuddyState.soundPlayer = WebAudioBufferPlayer;
  AonyxBuddyState.getJWT = async () => {
    if (!ObjectContainsKey(import.meta, "env"))
      throw new Error("env not found");
    const token =
      (import.meta as unknown as { env: { [key: string]: string } }).env
        .VITE_SE_JWT ?? "";
    return token;
  };
} else {
  AonyxBuddyState.inputEmitter = new EventTarget();
  AonyxBuddyState.soundPlayer = NodeAudioBufferPlayer;
  AonyxBuddyState.getJWT = async () => {
    if (!ObjectContainsKey(process.env, "VITE_SE_JWT"))
      throw new Error("VITE_SE_JWT not found");
    return process.env.VITE_SE_JWT;
  };
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
    getJWT: AonyxBuddyState.getJWT,
    callback: AonyxBuddyState.eventCallback,
    outputEmitter: undefined,
  },
  audioQueueOptions: {
    logger: console,
    playerConstructor: (options) => {
      return new AonyxBuddyState.soundPlayer({
        ...options,
        ctx: AonyxBuddyState.ctx,
        analyser: AonyxBuddyState.analyser,
      });
    },
  },
  processStreamEventOptions: {
    logger: console,
    config: DefaultAonyxBuddyConfig,
  },
};

const client = new AonyxBuddyWebClient();
client.Start(options);

const ttsOptions: TTextToSpeechOptions = {
  voiceID: "Brian",
  commandIdentifier: "$",
  availableVoices: ["Brian", "Amy"],
  soundClipURLs: {
    DISCORDJOIN:
      "https://www.aonyxlimited.com/resources/audio/discord-join.mp3",
    DISCORDLEAVE:
      "https://www.aonyxlimited.com/resources/audio/discord-leave.mp3",
    KNOCK: "https://www.aonyxlimited.com/resources/audio/knock.mp3",
    HUH: "https://www.aonyxlimited.com/resources/audio/huh.mp3",
    VINEBOOM: "https://www.aonyxlimited.com/resources/audio/vine-boom.mp3",
  },
};

const message =
  "$DISCORDJOIN Hey why does it smell so bad in here? $DISCORDJOIN $Amy I don't know, maybe it's because you're here. $DISCORDLEAVE $Brian That's not very nice. $KNOCK$HUH$VINEBOOM$DISCORDLEAVE";

const bufferRequests = ParseTextToSpeechText(message, ttsOptions);

if (typeof bufferRequests[0] === "undefined")
  throw new Error("bufferRequests[0] is undefined");

FetchAndPopulateBuffers(bufferRequests).then((bufferDatas) => {
  client.audioService?.Queue(...bufferDatas);
  client.audioService?.PlayQueue();
});

AonyxBuddyState.inputEmitter.addEventListener("beforeunload", () => {
  client.Stop();
});
