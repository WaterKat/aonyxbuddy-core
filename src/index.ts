export { IClientConfig, DefaultAonyxBuddyConfig } from "./config/index.js";
export {
  CreateAudioQueue,
  GetStreamElementsVoiceAudioBuffer,
} from "./ui/audio/index.js";
export {
  EStreamEventType,
  GetProcessEventFunction,
  TStreamEvent,
} from "./core/stream-events/index.js";
export {
  ConvertLegacyProcessorConfig,
  IsLegacyEventProcessorConfig,
} from "./core/stream-events/legacy-support.js";
export { GetStreamEventResponse } from "./core/index.js";
export { default as TranslateStreamElementsEventToAonyxEvent } from "./bridge/stream-elements/event-translator.ts";
