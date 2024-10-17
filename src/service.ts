import {
  AonyxBuddyEventService,
  TAonyxBuddyEventServiceOptions,
} from "./events/stream-event-listener/stream-event-listener-service.js";
import {
  StreamElementsEventsService,
  TStreamElementsEventsServiceOptions,
} from "./events/streamelements-overlay/stream-elements-service.js";
import {
  StreamElementsSocketService,
  TStreamElementsSocketServiceOptions,
} from "./events/streamelements-ws-listener/streamelements-socket-service.js";

import {
  //IClientConfig,
  ILogger,
  IService,
} from "./index.js";

export type TAonyxBuddyClientState = {
  [key: string]: unknown;
};

export type TAonyxBuddyWebClientOptions = {
  logger: ILogger;
  streamEventService?: TAonyxBuddyEventServiceOptions;
  streamElementsSocketOptions?: TStreamElementsSocketServiceOptions;
  streamElementsOptions?: TStreamElementsEventsServiceOptions;
};

export class AonyxBuddyWebClient
  implements IService<TAonyxBuddyWebClientOptions>
{
  options?: TAonyxBuddyWebClientOptions = undefined;

  streamElementsEventService?: StreamElementsEventsService = undefined;
  streamEventService?: AonyxBuddyEventService = undefined;
  streamElementsSocketService?: StreamElementsSocketService = undefined;

  constructor() {
    this.streamElementsEventService = new StreamElementsEventsService();
    this.streamEventService = new AonyxBuddyEventService();
    this.streamElementsSocketService = new StreamElementsSocketService();
  }

  Start(options: TAonyxBuddyWebClientOptions): void {
    this.options = options;

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
  }
  Restart(): void {
    this.options?.logger?.info("Restarting AonyxBuddyWebClient");
    this.Stop();
    if (!this.options) return;
    this.Start(this.options);
  }
}
