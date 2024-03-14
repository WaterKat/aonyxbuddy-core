import { IClientConfig } from "./config/iclient-config.js";

import { GetTextToSpeech } from "./ui/text-to-speech/index.js";
import { GetTextQueue, IVariableContainer } from "./core/queues/text-queue.js";

interface RendererParams {
  [key: string]: IVariableContainer;
}

export function GetAonyxBuddyInstance(
  config: IClientConfig,
  rendererParams?: RendererParams
) {

  const tts = GetTextToSpeech(config.tts);
  const speechAmplitudeVariable: IVariableContainer = rendererParams ? rendererParams["mouth"] : { value: 0 };
  const textqueue = GetTextQueue(tts, speechAmplitudeVariable);

  return {
    TextToSpeech: tts,
    TextQueue: textqueue,
  };
}

