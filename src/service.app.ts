import DefaultAonyxBuddyConfig from "./config/default-config.js";
import { ObjectContainsKey } from "./lib.js";
import { AonyxBuddyClient, TAonyxBuddyClientOptions } from "./service.js";
import { NodeAudioBufferPlayer } from "./ui/audio/node-cli/node-audiobuffer-player.js";
import { WaitUntilInteracted } from "./ui/audio/web/wait-until-interacted.js";
import { WebAudioBufferPlayer } from "./ui/audio/web/web-audiobuffer-player.js";
import { TaggedLogger } from "./types.js";

import dotenv from "dotenv";
dotenv.config();

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

const options: TAonyxBuddyClientOptions = {
  logger: new TaggedLogger({
    logger: console,
    tag: "AonyxBuddyService",
    brackets: true,
    timestamp: true,
    logType: true,
  }),
  streamEventServiceOptions: {
    logger: new TaggedLogger({
      logger: console,
      tag: "AonyxBuddy_Events",
      brackets: true,
      timestamp: true,
      logType: true,
    }),
    callback: AonyxBuddyState.eventCallback,
    inputEmitter: AonyxBuddyState.inputEmitter,
  },
  streamElementsOptions: {
    logger: new TaggedLogger({
      logger: console,
      tag: "SE_OverlayEvents",
      brackets: true,
      timestamp: true,
      logType: true,
    }),
    callback: AonyxBuddyState.eventCallback,
    inputEventEmitter: AonyxBuddyState.inputEmitter,
  },
  streamElementsSocketOptions: {
    logger: new TaggedLogger({
      logger: console,
      tag: "SE_SocketEvents",
      brackets: true,
      timestamp: true,
      logType: true,
    }),
    listenToTestEvents: true,
    getJWT: AonyxBuddyState.getJWT,
    callback: AonyxBuddyState.eventCallback,
  },
  audioQueueOptions: {
    logger: new TaggedLogger({
      logger: console,
      tag: "AudioQueue",
      brackets: true,
      timestamp: true,
      logType: true,
    }),
    playerConstructor: (options) => {
      return new AonyxBuddyState.soundPlayer({
        ...options,
        ctx: AonyxBuddyState.ctx,
        analyser: AonyxBuddyState.analyser,
      });
    },
  },
  processStreamEventOptions: {
    logger: new TaggedLogger({
      logger: console,
      tag: "ProcessStreamEvent",
      brackets: true,
      timestamp: true,
      logType: true,
    }),
    config: DefaultAonyxBuddyConfig,
  },
  responseServiceOptions: {
    logger: new TaggedLogger({
      logger: console,
      tag: "ResponseService",
      brackets: true,
      timestamp: true,
      logType: true,
    }),
    responses: DefaultAonyxBuddyConfig.responses["voice"],
  },
  textToSpeechOptions: {
    logger: new TaggedLogger({
      logger: console,
      tag: "TextToSpeech",
      brackets: true,
      timestamp: true,
      logType: true,
    }),
    voiceID: DefaultAonyxBuddyConfig.tts.voice,
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
  },
};

const client = new AonyxBuddyClient(options);
client.Start();

AonyxBuddyState.inputEmitter.addEventListener("beforeunload", () => {
  client.Stop();
});

/**
 * OUTLINE
 * AonyxBuddy should contain the following in this order
 * 1. Shared State, a global object that contains shared state between the different parts of the application
 *
 * 2. Connect to Raw Event Source where the application listens for events
 * 3. Process Raw Events into Stream Events
 * 4. Process Stream Events into Responses
 * 5. Initiate Audio Playback
 * 6. Per Event, Process Responses and Initiate Audio Playback
 *
 *
 */
