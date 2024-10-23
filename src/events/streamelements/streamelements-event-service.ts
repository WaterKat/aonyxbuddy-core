import { TStreamEvent } from "../../core/index.js";
import { ObjectContainsKey, ObjectMatchesTemplate } from "../../lib.js";
import { ILogger, IService } from "../../types.js";
import { SERawEvent, SERawEventTemplate } from "./types.js";
import { TranslateStreamElementsEventToAonyxEvent as EventTranslator } from "./translate-event-to-aonyxbuddy.js";

export type TStreamElementsOverlayEventsServiceOptions = {
  callback: (event: TStreamEvent) => void;
  inputEventEmitter: EventTarget;
  eventType?: string;
  logger?: ILogger;
};

export class StreamElementsOverlayEventsService implements IService {
  options: TStreamElementsOverlayEventsServiceOptions;
  defaultEventListener: string = "onEventReceived" as const;

  boundCallback: (...args: unknown[]) => void = () => {};

  constructor(options: TStreamElementsOverlayEventsServiceOptions) {
    this.options = options;
  }

  onEvent(data: unknown) {
    if (!ObjectMatchesTemplate<SERawEvent>(data, SERawEventTemplate)) {
      this.options?.logger?.warn("Invalid event received", data);
      return;
    }

    if (
      ObjectContainsKey(data.detail.event, "itemId") &&
      data.detail.event.itemId !== undefined
    ) {
      data.detail.listener = "redemption-latest";
    }

    const streamElementEvent = {
      ...data.detail.event,
      type: data.detail.listener.split("-")[0],
    };

    const aonyxStreamEvent = EventTranslator(streamElementEvent);
    if (aonyxStreamEvent) {
      this.options?.callback(aonyxStreamEvent);
    }
  }

  Start(): void {
    this.options.logger?.info("Starting StreamElementsService");

    this.boundCallback = this.onEvent.bind(this);

    this.options?.inputEventEmitter.addEventListener(
      this.options.eventType ?? this.defaultEventListener,
      this.boundCallback
    );
  }

  Stop(): void {
    this.options?.logger?.info("Stopping StreamElementsService");

    this.options.inputEventEmitter.removeEventListener(
      this.options.eventType ?? this.defaultEventListener,
      this.boundCallback
    );
  }

  Restart(): void {
    this.options?.logger?.info("Restarting StreamElementsService");
    this.Stop();
    this.Start();
  }
}
