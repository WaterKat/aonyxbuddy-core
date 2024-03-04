/*
import { GetTextQueue } from "./text-queue.js";
import GetTextToSpeech from "../text-to-speech/index.js";

import * as audio from "standardized-audio-context-mock";

import { test } from "bun:test";

test("text-queue", async () => {
  const tts = GetTextToSpeech({
    voice: "Brian",
    context: new audio.AudioContext() as any,
  });

  const varExample = {
    value: 0,
  };

  let mockWrapper: ReturnType<typeof GetTextToSpeech> = {
    context: new audio.AudioContext() as any,
    analyzer: new audio.AudioContext().createAnalyser() as any,
    Speak: async (text: string, onStop?: () => void) => {
      console.log("mock speaking: " + text);
      return new Promise<undefined>((resolve) =>
        setTimeout(() => {
          resolve(undefined);
          if (onStop) onStop();
        }, 2000)
      );
    },
    Stop: () => {},
  };
  mockWrapper.analyzer.getByteTimeDomainData = () => {};

  const queue = GetTextQueue(mockWrapper, varExample);

  queue.Append("hello world! A");
  queue.Append("hello world! B");
  queue.Append("hello world! C");
  console.log(queue.taskQueue)
  console.log(queue.IsRunning());
  await new Promise((resolve) => 
  setInterval(() => {
    if (queue.taskQueue.length < 1 ) {
        resolve(undefined);
    }
  console.log(queue.taskQueue)
  }
    , 1000));
  console.log(queue.IsRunning());
}, { timeout: 20000});
*/