import { IClientConfig } from "./config/iclient-config.js";

//import { CreateTextToSpeech } from "./ui/text-to-speech/index.js";
import { GetTextQueue, IVariableContainer } from "./core/old.queues/text-queue.js";

interface RendererParams {
  name: string,
  value: number
}

export function GetAonyxBuddyInstance(
  config: IClientConfig,
  rendererParams?: RendererParams
) {

//  const tts = CreateTextToSpeech(config.tts);
  const speechAmplitudeVariable: IVariableContainer = rendererParams as IVariableContainer;
//  const textqueue = GetTextQueue(tts, speechAmplitudeVariable);

  return {
   // TextToSpeech: tts,
//    TextQueue: textqueue,
  };
}

