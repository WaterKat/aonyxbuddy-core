import {
  StreamEventService,
  TStreamEventServiceOptions,
} from "./events/stream-event-listener/stream-event-listener-service.js";
import {
  StreamElementsService,
  TStreamElementsServiceOptions,
} from "./events/streamelements-overlay/stream-elements-service.js";
import {
  StreamElementsSocketService,
  TStreamElementsSocketServiceOptions,
} from "./events/streamelements-ws-listener/streamelements-ws-listener-service.js";

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
  streamEventService?: TStreamEventServiceOptions;
  streamElementsSocketOptions?: TStreamElementsSocketServiceOptions;
  streamElementsOptions?: TStreamElementsServiceOptions;
};

export class AonyxBuddyWebClient
  implements IService<TAonyxBuddyWebClientOptions>
{
  options?: TAonyxBuddyWebClientOptions = undefined;

  streamElementsEventService?: StreamElementsService = undefined;
  streamEventService?: StreamEventService = undefined;
  streamElementsSocketService?: StreamElementsSocketService = undefined;

  constructor() {
    this.streamElementsEventService = new StreamElementsService();
    this.streamEventService = new StreamEventService();
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
