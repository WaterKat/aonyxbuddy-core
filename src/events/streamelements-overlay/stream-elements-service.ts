import { TStreamEvent } from "../../core/index.js";
import { ObjectContainsKey, ObjectMatchesTemplate } from "../../lib.js";
import { ILogger, IService } from "../../types.js";
import { SERawEvent, SERawEventTemplate } from "./types.js";
import EventTranslator from "./event-translator.js";

export type TStreamElementsEventsServiceOptions = {
  callback: (event: TStreamEvent) => void;
  inputEmitter: EventTarget | Window;
  logger?: ILogger;
};

export class StreamElementsEventsService
  implements IService<TStreamElementsEventsServiceOptions>
{
  options?: TStreamElementsEventsServiceOptions = undefined;
  bind: (...args: unknown[]) => void = () => {};
  eventListener: string = "onEventReceived";

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

  Start(options: TStreamElementsEventsServiceOptions): void {
    this.options = options;

    this.options.logger?.info("Starting StreamElementsService");

    this.bind = this.onEvent.bind(this);

    this.options?.inputEmitter.addEventListener(this.eventListener, this.bind);
  }

  Stop(): void {
    this.options?.logger?.info("Stopping StreamElementsService");

    (this.options?.inputEmitter ?? window).removeEventListener(
      this.eventListener,
      this.bind
    );
  }

  Restart(): void {
    this.options?.logger?.info("Restarting StreamElementsService");
    this.Stop();
    if (!this.options) return;
    this.Start(this.options);
  }
}
