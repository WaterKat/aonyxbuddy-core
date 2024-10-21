import {
  ResponseService,
  TReponseServiceOptions,
} from "./core/response-service.js";
import {
  AonyxBuddyEventService,
  TAonyxBuddyEventServiceOptions,
} from "./events/aonyxbuddy-events/aonyxbuddy-event-service.js";
import {
  StreamElementsEventsService,
  TStreamElementsEventsServiceOptions,
} from "./events/streamelements/streamelements-event-service.js";
import {
  StreamElementsSocketService,
  TStreamElementsSocketServiceOptions,
} from "./events/streamelements/streamelements-socket-service.js";

import {
  ProcessStreamEventService,
  TProcessStreamEventOptions,
} from "./core/process-streamevent-service.js";

import { ILogger, IService } from "./index.js";

import {
  AudioService,
  TAudioServiceOptions,
} from "./ui/audio/audio-service.js";

export type TAonyxBuddyClientState = {
  [key: string]: unknown;
};

export type TAonyxBuddyClientOptions = {
  logger: ILogger;
  streamEventService?: TAonyxBuddyEventServiceOptions;
  streamElementsSocketOptions?: TStreamElementsSocketServiceOptions;
  streamElementsOptions?: TStreamElementsEventsServiceOptions;
  audioQueueOptions?: TAudioServiceOptions;
  responseServiceOptions?: TReponseServiceOptions;
  processStreamEventOptions?: TProcessStreamEventOptions;
};

export class AonyxBuddyClient implements IService {
  options: TAonyxBuddyClientOptions;
  eventTarget: EventTarget;


  streamElementsEventService?: StreamElementsEventsService = undefined;
  streamEventService?: AonyxBuddyEventService = undefined;
  streamElementsSocketService?: StreamElementsSocketService = undefined;
  audioService?: AudioService = undefined;
  responseService?: ResponseService = undefined;
  processStreamEventService?: ProcessStreamEventService = undefined;

  constructor(options: TAonyxBuddyClientOptions) {
    this.options = options;
    this.eventTarget = new EventTarget();

    this.streamElementsEventService = new StreamElementsEventsService();
    this.streamEventService = new AonyxBuddyEventService();
    this.streamElementsSocketService = new StreamElementsSocketService();
  }

  Start(options: TAonyxBuddyClientOptions): void {
    this.options = options;

    if (options.audioQueueOptions)
      this.audioService = new AudioService(options.audioQueueOptions);

    if (options.responseServiceOptions)
      this.responseService = new ResponseService(
        options.responseServiceOptions
      );

    if (this.options?.processStreamEventOptions)
      this.processStreamEventService = new ProcessStreamEventService(
        this.options.processStreamEventOptions
      );

    this.options?.logger?.info("Starting AonyxBuddyWebClient");

    if (this.options.streamElementsOptions) {
      this.streamElementsEventService?.Start(
        this.options.streamElementsOptions
      );
    }

    if (this.options.streamElementsSocketOptions) {
      this.streamElementsSocketService?.Start(
        this.options.streamElementsSocketOptions
      );
    }

    if (this.options.streamEventService) {
      this.streamEventService?.Start(this.options.streamEventService);
    }
  }

  Stop(): void {
    this.options?.logger?.info("Stopping AonyxBuddyWebClient");
    this.streamElementsEventService?.Stop();
    this.streamEventService?.Stop();
    this.audioService?.StopAndClearQueue();
  }
  Restart(): void {
    this.options?.logger?.info("Restarting AonyxBuddyWebClient");
    this.Stop();
    if (!this.options) return;
    this.Start(this.options);
  }
}
