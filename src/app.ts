/// <reference lib="dom" />

/** Your main configuration file type */
import { IClientConfig, DefaultAonyxBuddyConfig } from "./config/index.js";

import {
  InitializeRenderer,
  RenderParams,
} from "./ui/sprite-rendering/index.js";

import {
  CreateAudioQueue,
  GetStreamElementsVoiceAudioBuffer,
} from "./ui/audio/index.js";

import { ListenForStreamElementsEvents } from "./bridge/stream-elements/index.js";

import { GetAonyxBuddyStreamEventListener } from "./bridge/stream-event-listener/index.js";

import {
  EStreamEventType,
  GetProcessEventFunction,
  TStreamEvent,
} from "./core/stream-events/index.js";

import {
  ConvertLegacyProcessorConfig,
  IsLegacyEventProcessorConfig,
} from "./core/stream-events/legacy-support.js";

import { GetStreamEventResponse } from "./core/index.js";

async function CreateAonyxBuddy(config: IClientConfig) {
  /**
   * AudioQueue initialization
   * Renderer initialization
   */
  const { audioQueue, renderer } = {
    audioQueue: await CreateAudioQueue({ fftSize: 32 }),
    renderer: await InitializeRenderer(config.spriteRendering),
  };

  if (!renderer || !audioQueue) {
    console.error("Failed to initialize renderer or audioQueue. Exiting.");
    return;
  }

  const talkingParam = renderer.config.params.find(
    (param) => param.name === "talking"
  );

  const muteParam = renderer.config.params.find(
    (param) => param.name === "mute"
  );

  /**
   * * This is most stateful part of the code
   * The rendering loops for aonyxbuddy
   * mouthMax is the maximum amplitude of the mouth
   * freqMax is the maximum values for frequency of the mouth
   */
  let active = true;

  let mouthMax = 0;
  let freqMax: number[] = [0];
  const paramUpdateLoop = setInterval(() => {
    if (!talkingParam || !active) {
      clearInterval(paramUpdateLoop);
      return;
    }
    /** older simpler version */
    //    talkingParam.value = audioQueue.GetAmplitude();

    /** newer version gives better vowel/cosonant visuals */
    const frequencies = audioQueue.GetFrequencyData();
    if (frequencies.length > freqMax.length) {
      freqMax = new Array(frequencies.length).fill(0);
    }
    freqMax = frequencies.map((f, i) => Math.max(f, freqMax[i]));
    frequencies.forEach((f, i) => (f /= freqMax[i]));

    const amplitude = Math.abs(
      frequencies.reduce((a, b, index) => {
        const weight = index < frequencies.length / 4 ? 1 : -1;
        return a + b * weight;
      }, 0)
    );

    mouthMax = Math.max(amplitude, mouthMax);

    /** assign param */
    talkingParam.value = amplitude / mouthMax;
  }, 1000 / config.spriteRendering.defaultFPS);

  function RenderLoop() {
    if (!renderer || !active) {
      return;
    }
    RenderParams(renderer.ctx, renderer.config);

    if (config.spriteRendering.defaultFPS > 0) {
      setTimeout(() => {
        requestAnimationFrame(RenderLoop);
      }, 1000 / config.spriteRendering.defaultFPS);
    } else {
      requestAnimationFrame(RenderLoop);
    }
  }
  RenderLoop();

  /** event queues go here */
  let promiseQueueRunning = false;
  const promiseQueue: (() => Promise<void>)[] = [];

  function RunPromiseQueue() {
    if (promiseQueue.length > 0 && !promiseQueueRunning && active) {
      promiseQueueRunning = true;
      const speechFunction = promiseQueue.shift();
      if (speechFunction) {
        speechFunction().then(() => {
          promiseQueueRunning = false;
          RunPromiseQueue();
        });
      }
    }
  }

  /**
   * * These are the callbacks for event behaviour
   * TODO Add stateful behaviour
   *  TODO (re)add mute feature
   */
  const getProcessEventOptions = IsLegacyEventProcessorConfig(config)
    ? ConvertLegacyProcessorConfig(config)
    : config;
  const ProcessEvent = GetProcessEventFunction(getProcessEventOptions);

  console.log(
    "ProcessEvent:",
    getProcessEventOptions,
    IsLegacyEventProcessorConfig(config)
  );

  function HandleCommand(event: TStreamEvent) {
    console.log("Command:", event);
    if (event.type !== EStreamEventType.COMMAND) {
      console.error("HandleCommand: event is not a command.");
      return;
    }

    const command = event.action.toLocaleLowerCase();

    switch (command) {
      case "debug":
        break;
      case "say":
        promiseQueue.push(
          () =>
            new Promise<void>((resolve, reject) => {
              audioQueue.QueueAudioBuffer(
                GetStreamElementsVoiceAudioBuffer(
                  audioQueue.context,
                  event.args
                )
              );
              audioQueue.PlayQueue().then(resolve).catch(reject);
            })
        );
        RunPromiseQueue();
        break;
      case "skip":
        if (event.args.trim().length < 1) {
          audioQueue.StopAndClearQueue();
        } else if (!isNaN(+event.args.trim())) {
          const skipCount = Math.max(0, +event.args - 1);
          promiseQueue.splice(0, skipCount);
          audioQueue.StopAndClearQueue();
        } else if (event.args.trim() === "all") {
          promiseQueue.splice(0, promiseQueue.length);
          audioQueue.StopAndClearQueue();
        }
        break;
      // TODO add mute feature
    }
  }

  function HandleEvent(raw: TStreamEvent) {
    if (!active) return;

    const loggedEvent = ProcessEvent(raw);
    const event = loggedEvent.getValue();

    console.log("Event:", event, loggedEvent.getLogs());

    if (event.type === EStreamEventType.COMMAND) return HandleCommand(event);

    const response = GetStreamEventResponse(event, {
      responses: config.responses["voice"],
      key: event.type,
      randomBetween01Func: Math.random,
    });

    if (!response || response.length < 0) return;

    /** queue speech */
    const speechFunc = () =>
      new Promise<void>((resolve, reject) => {
        audioQueue.QueueAudioBuffer(
          GetStreamElementsVoiceAudioBuffer(audioQueue.context, response)
        );
        audioQueue.PlayQueue().then(resolve).catch(reject);
      });

    promiseQueue.push(speechFunc);

    RunPromiseQueue();
  }

  /** event listeners go here */
  const streamElementsListener = ListenForStreamElementsEvents(HandleEvent);
  const aonyxListener = GetAonyxBuddyStreamEventListener(HandleEvent);

  if (!streamElementsListener && !aonyxListener) {
    console.error("Failed to initialize event listener. Exiting.");
    return;
  }

  /** first messages go here */

  const firstMessage = () =>
    new Promise<void>((resolve, reject) => {
      audioQueue.QueueAudioBuffer(
        GetStreamElementsVoiceAudioBuffer(
          audioQueue.context,
          `A-onyx Buddy systems online. ${config.nickname}, is active.`
        )
      );
      audioQueue.PlayQueue().then(resolve).catch(reject);
    });
  promiseQueue.push(firstMessage);
  RunPromiseQueue();

  return {
    Stop: () => {
      active = false;
      clearInterval(paramUpdateLoop);
      audioQueue.StopAndClearQueue();
      streamElementsListener?.RemoveListener();
      aonyxListener?.RemoveListener();
    },
  };
}

declare const AonyxBuddyConfig: IClientConfig;

if (typeof window !== "undefined") {
  console.log("AonyxBuddy created, refer to window.aonyxbuddy for access.");
  (window as any)["aonyxbuddy"] = CreateAonyxBuddy(
    typeof AonyxBuddyConfig !== "undefined"
      ? AonyxBuddyConfig
      : DefaultAonyxBuddyConfig
  );
} else {
  console.warn("AonyxBuddy: No window object found.");
  CreateAonyxBuddy(
    typeof AonyxBuddyConfig !== "undefined"
      ? AonyxBuddyConfig
      : DefaultAonyxBuddyConfig
  );
}

//# sourceURL=browsertools://aonyxbuddy/aonyxbuddy.js
