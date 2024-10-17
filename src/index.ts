export { AonyxBuddyWebClient } from "./service.js";
export * from "./types.js";

// original file
export { type IClientConfig, DefaultAonyxBuddyConfig } from "./config/index.js";
export {
  CreateAudioQueue,
  GetStreamElementsVoiceAudioBuffer,
} from "./ui/audio/index.js";
export {
  EStreamEventType,
  GetProcessEventFunction,
  type TStreamEvent,
} from "./core/stream-events/index.js";
export {
  ConvertLegacyProcessorConfig,
  IsLegacyEventProcessorConfig,
} from "./core/stream-events/legacy-support.js";
export { GetStreamEventResponse } from "./core/index.js";
export { default as TranslateStreamElementsEventToAonyxEvent } from "./events/streamelements/translate-event-to-aonyxbuddy.js";
