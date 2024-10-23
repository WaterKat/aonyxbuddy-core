import {
  ResponseService,
  TReponseServiceOptions,
} from "./core/response-service.js";
import {
  AonyxBuddyEventService,
  TAonyxBuddyEventServiceOptions,
} from "./events/aonyxbuddy-events/aonyxbuddy-event-service.js";
import {
  StreamElementsOverlayEventsService,
  TStreamElementsOverlayEventsServiceOptions,
} from "./events/streamelements/streamelements-event-service.js";
import {
  StreamElementsSocketService,
  TStreamElementsSocketServiceOptions,
} from "./events/streamelements/streamelements-socket-service.js";

import {
  ProcessStreamEventService,
  TProcessStreamEventOptions,
} from "./core/process-streamevent-service.js";


import { ILogger, IService, TStreamEvent } from "./index.js";

import {
  AudioService,
  TAudioServiceOptions,
} from "./ui/audio/audio-service.js";
import {
  GenericCallbackWrapper,
} from "./lib.js";
import { TPopulatedAudioBufferData, TTextToSpeechServiceOptions, TextToSpeechService } from "./ui/audio/text-to-speech.js";
import { TTwitchIRCServiceOptions, TwitchIRCService } from "./events/twitch/twitchirc-service.js";

export type TAonyxBuddyClientState = {
  [key: string]: unknown;
};

export type TAonyxBuddyClientOptions = {
  logger: ILogger;

  streamElementsOptions?: TStreamElementsOverlayEventsServiceOptions;
  streamElementsSocketOptions?: TStreamElementsSocketServiceOptions;
  streamEventServiceOptions?: TAonyxBuddyEventServiceOptions;
  twitchIRCServiceOptions?: TTwitchIRCServiceOptions;

  processStreamEventOptions: TProcessStreamEventOptions;
  responseServiceOptions: TReponseServiceOptions;

  textToSpeechOptions: TTextToSpeechServiceOptions
  audioQueueOptions: TAudioServiceOptions;
};

type TAonyxBuddyCallbackMap = {
  onRawStreamEvent: ((event: TStreamEvent) => void)[];
  onProcessedStreamEvent: ((event: TStreamEvent) => void)[];
  onResponse: ((response: string) => void)[];
  onAudioRequest: ((request: TPopulatedAudioBufferData | TPopulatedAudioBufferData[]) => void)[];
};

export class AonyxBuddyClient implements IService {
  options: TAonyxBuddyClientOptions;
  callbacks: GenericCallbackWrapper<TAonyxBuddyCallbackMap>;

  onRawStreamEventType = "onRawStreamEvent" as const;
  onProcessedStreamEventType = "onProcessedStreamEvent" as const;
  onResponse = "onResponse" as const;
  onAudioRequest = "onAudioRequest" as const;

  //#region [ EVENTS ] Params
  streamElementsEventService?: StreamElementsOverlayEventsService = undefined;
  streamElementsSocketService?: StreamElementsSocketService = undefined;
  streamEventService?: AonyxBuddyEventService = undefined;
  twitchIRCService?: TwitchIRCService = undefined;
  //#endregion

  //#region [ PROCESS ] Params
  processStreamEventService: ProcessStreamEventService;
  responseService: ResponseService;
  //#endregion

  //#region [ AUDIO ] Params
  textToSpeechService: TextToSpeechService;
  audioService: AudioService;
  //#endregion

  constructor(options: TAonyxBuddyClientOptions) {
    this.options = options;
    this.callbacks = new GenericCallbackWrapper<TAonyxBuddyCallbackMap>({
      logger: options.logger,
      callbacks: {
        onRawStreamEvent: [],
        onProcessedStreamEvent: [],
        onResponse: [],
        onAudioRequest: [],
      },
    });

    if (
      !options.streamElementsOptions &&
      !options.streamElementsSocketOptions &&
      !options.streamEventServiceOptions
    ) {
      this.options.logger?.error(
        "AonyxBuddyClient: No event service options provided"
      );
      throw new Error("No event service options provided");
    }

    //#region [ EVENTS ] Allocs
    if (this.options.streamElementsOptions) {
      this.streamElementsEventService = new StreamElementsOverlayEventsService({
        ...this.options.streamElementsOptions,
        callback: (data) => {
          this.callbacks.call(this.onRawStreamEventType, data);
          this.options.streamElementsOptions?.callback?.(data);
        },
      });
    }

    if (this.options.streamElementsSocketOptions) {
      this.streamElementsSocketService = new StreamElementsSocketService({
        ...this.options.streamElementsSocketOptions,
        callback: (data) => {
          this.callbacks.call(this.onRawStreamEventType, data);
          this.options.streamElementsSocketOptions?.callback?.(data);
        },
      });
    }

    if (this.options.streamEventServiceOptions) {
      this.streamEventService = new AonyxBuddyEventService({
        ...this.options.streamEventServiceOptions,
        callback: (data) => {
          this.callbacks.call(this.onRawStreamEventType, data);
          this.options.streamEventServiceOptions?.callback?.(data);
        },
      });
    }

    if (this.options.twitchIRCServiceOptions) {
      this.twitchIRCService = new TwitchIRCService({
        ...this.options.twitchIRCServiceOptions,
        callback: (data) => {
          this.callbacks.call(this.onRawStreamEventType, data);
          this.options.twitchIRCServiceOptions?.callback?.(data);
        },
      });
    }
    //#endregion

    //#region [ PROCESS ] Allocs
    this.processStreamEventService = new ProcessStreamEventService(
      options.processStreamEventOptions
    );
    this.callbacks.add(this.onRawStreamEventType, (data) => {
      const processEvent = this.processStreamEventService.processEvent(data);
      this.callbacks.call(this.onProcessedStreamEventType, processEvent);
    });

    this.responseService = new ResponseService(options.responseServiceOptions);
    this.callbacks.add(this.onProcessedStreamEventType, (data) => {
      const response = this.responseService.GetResponse(data);
      this.callbacks.call(this.onResponse, response);
    });
    //#endregion

    //#region [ AUDIO ] Allocs
    this.textToSpeechService = new TextToSpeechService(options.textToSpeechOptions);
    this.callbacks.add(this.onResponse, (response) => {
      const promises = this.textToSpeechService.GetPopulatedBufferDataPromises(response);
      promises.then((data) => {
        this.callbacks.call(this.onAudioRequest, data);
      });
    });


    this.audioService = new AudioService(options.audioQueueOptions);
    this.callbacks.add(this.onAudioRequest, (data) => {
      this.audioService.Queue(...[data].flat());
      this.audioService.PlayQueue();
    });

    this.callbacks.call(this.onResponse,"Hello World! A-onyx Buddy is ready to go!");
    //#endregion
  }

  Start(): void {
    this.options?.logger?.info("Starting AonyxBuddyWebClient");

    this.streamElementsEventService?.Start();
    this.streamElementsSocketService?.Start();
    this.streamEventService?.Start();
    this.twitchIRCService?.Start();

    this.processStreamEventService.Start();
    //this.responseService.Start();
    
    //this.textToSpeechService.Start();
    //this.audioService.Start();
  }

  Stop(): void {
    this.options?.logger?.info("Stopping AonyxBuddyWebClient");
    
    this.streamElementsEventService?.Stop();
    this.streamElementsSocketService?.Stop();
    this.streamEventService?.Stop();
    this.twitchIRCService?.Stop();

    this.processStreamEventService.Stop();
    //this.responseService.Stop();

    //this.textToSpeechService.Stop();
    //this.audioService.Stop();
  }
  Restart(): void {
    this.options?.logger?.info("Restarting AonyxBuddyWebClient");
    this.Stop();
    if (!this.options) return;
    this.Start();
  }
}
