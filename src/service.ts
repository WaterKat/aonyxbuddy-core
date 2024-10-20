import { ResponseService, TReponseServiceOptions } from "./core/response-service.js";
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
  //IClientConfig,
  ILogger,
  IService,
} from "./index.js";
import { AudioService, TAudioServiceOptions } from "./ui/audio/audio-service.js";

export type TAonyxBuddyClientState = {
  [key: string]: unknown;
};

export type TAonyxBuddyWebClientOptions = {
  logger: ILogger;
  streamEventService?: TAonyxBuddyEventServiceOptions;
  streamElementsSocketOptions?: TStreamElementsSocketServiceOptions;
  streamElementsOptions?: TStreamElementsEventsServiceOptions;
  audioQueueOptions?: TAudioServiceOptions;
  responseServiceOptions?: TReponseServiceOptions;
};

export class AonyxBuddyWebClient
  implements IService<TAonyxBuddyWebClientOptions>
{
  options?: TAonyxBuddyWebClientOptions = undefined;

  streamElementsEventService?: StreamElementsEventsService = undefined;
  streamEventService?: AonyxBuddyEventService = undefined;
  streamElementsSocketService?: StreamElementsSocketService = undefined;
  audioService?: AudioService = undefined;
  responseService?: ResponseService = undefined;

  constructor() {
    this.streamElementsEventService = new StreamElementsEventsService();
    this.streamEventService = new AonyxBuddyEventService();
    this.streamElementsSocketService = new StreamElementsSocketService();
  }

  Start(options: TAonyxBuddyWebClientOptions): void {
    this.options = options;

    if (options.audioQueueOptions) this.audioService = new AudioService(options.audioQueueOptions);
    if (options.responseServiceOptions) this.responseService = new ResponseService(options.responseServiceOptions);

    this.options?.logger?.info("Starting AonyxBuddyWebClient");

    if (this.options.streamElementsOptions) {
      this.streamElementsEventService?.Start(
        this.options.streamElementsOptions
      );
    }

    if (this.options.streamElementsSocketOptions) {
      this.streamElementsSocketService?.Start(this.options.streamElementsSocketOptions);
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
