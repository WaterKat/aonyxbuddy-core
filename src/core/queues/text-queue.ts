import {
  CreateTextToSpeech, ITextToSpeechWrapper, GetAudioBufferAmplitude
} from "../../ui/text-to-speech/index.js";

type Speech = ReturnType<typeof CreateTextToSpeech>;

type SpeechTaskState =
  | "waiting"
  | "running";

export interface ISpeechTask {
  text: string
}

export interface IVariableContainer {
  value: number
}

export function GetTextQueue(
  tts: ITextToSpeechWrapper, variableWrapper?: IVariableContainer
) {
  const TIMEOUT_BETWEEN_TASKS = 0.25;
  const VARIABLE_DELAY = 1000 / 24;

  let enabled: boolean = true;
  let taskQueue: Array<ISpeechTask> = [];
  let running: boolean = false;
  let interval: ReturnType<typeof setInterval> = setInterval(() => { }, Infinity);

  function Stop() {
    enabled = false;
    taskQueue = [];
    running = false;
    if (interval) clearInterval(interval);
  }

  function Append(text: string) {
    taskQueue.push({ text });
    TryRunningQueue();
  };

  function TryRunningQueue() {
    if (running) return;
    const activeTask = taskQueue.shift();
    if (!activeTask) return;
    running = true;
    tts.Speak(activeTask.text, () => { running = false; });
    if (variableWrapper) {
      interval = setInterval(() => {
        if (!enabled || !running) {
          clearInterval(interval);

          TryRunningQueue();
          return;
        }
//        variableWrapper.value = GetAudioBufferAmplitude(tts.analyzer);
      }, VARIABLE_DELAY);
    }
  }

  function IsRunning() {
    return running;
  }

  /**
   * Skips a count of queued messages
   * @param count current running included
   * @return the remaining count of skips after being applied 
   */
  function Skip(count: number) {
    let currentCount = count;
    if (running) {
      currentCount -= 1;
      running = false;
      tts.Stop();
    }
    while (currentCount > 0) {
      const skippedTask = taskQueue.pop();
      if (skippedTask) {
        currentCount -= 1;
      } else {
        break;
      }
    }
    return currentCount;
  }

  return {
    Stop,
    Append,
    IsRunning,
    Skip,
    taskQueue
  }
}


