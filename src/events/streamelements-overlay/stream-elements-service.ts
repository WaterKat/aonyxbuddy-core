import { TStreamEvent } from "../../core/index.js";
import { ObjectContainsKey, ObjectMatchesTemplate } from "../../lib.js";
import { ILogger, IService } from "../../types.js";
import { SERawEvent, SERawEventTemplate } from "./types.js";
import EventTranslator from "./event-translator.js";

export type TStreamElementsServiceOptions = {
  callback: (event: TStreamEvent) => void;
  emitter?: EventTarget;
  logger?: ILogger;
};

export class StreamElementsService
  implements IService<TStreamElementsServiceOptions>
{
  options?: TStreamElementsServiceOptions = undefined;
  bind: (...args: unknown[]) => void = () => {};

  onEvent(data: unknown) {
    if (!ObjectMatchesTemplate<SERawEvent>(data, SERawEventTemplate))
    {
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

  Start(options: TStreamElementsServiceOptions): void {
    this.options = options;

    this.options.logger?.info("Starting StreamElementsService");

    //? Check if emitter is provided
    if (!this.options.emitter) {
      if (typeof window === "undefined") {
        this.options.logger?.error(
          "No emitter provided and window is not available"
        );
        return;
      }else {
        this.options?.logger?.warn("No emitter provided, using window");
      }
    } else {
      this.options?.logger?.info("Using provided emitter");
    }

    this.bind = this.onEvent.bind(this);

    (this.options?.emitter ?? window).addEventListener(
      "onEventReceived",
      this.bind
    );
  }

  Stop(): void {
    this.options?.logger?.info("Stopping StreamElementsService");

    (this.options?.emitter ?? window).removeEventListener(
      "onEventReceived",
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
