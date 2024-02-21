import { GetTextToSpeech, Audio } from "../text-to-speech/index";
import { ITextToSpeechWrapper } from "../text-to-speech/types";

type Speech = ReturnType<typeof GetTextToSpeech>;

type SpeechTaskState =
  | "waiting"
  | "running";

interface ISpeechTask {
  text: string
}

interface IVariableContainer {
  value: number
}

export function GetTextQueue(tts: ITextToSpeechWrapper, variableWrapper?: IVariableContainer) {
  const TIMEOUT_BETWEEN_TASKS = 0.25;
  const VARIABLE_DELAY = 1000 / 24;

  let enabled : boolean = true;
  let taskQueue : Array<ISpeechTask> = [];
  let running: boolean = false;
  let interval : ReturnType<typeof setInterval> = setInterval(()=>{}, Infinity);

  function Stop () { 
    enabled = false; 
    taskQueue = [];
    running = false;
    if (interval) clearInterval(interval);
  }

  function Append(text: string) {
    taskQueue.push({text});
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
        variableWrapper.value = Audio.GetAudioBufferAmplitude(tts.analyzer);
      }, VARIABLE_DELAY );
    }
  }

  function IsRunning() {
    return running;
  }

  /**
   * Skips a count of queued messages
   * @param count current running included
   */
  function Skip(count: number) {
    let currentCount = count;
    if (running) {
      currentCount -= 1;
      running = false;
      tts.Stop();
    }
    while (currentCount > 0){
      const skippedTask = taskQueue.pop();
      if (skippedTask) {
        currentCount -= 1;
      } else {
        break;
      }
    }
  }

  return {
    Stop,
    Append,
    IsRunning, 
    Skip,
    taskQueue
  }
}


