import { TStreamEvent, EStreamEventType } from "../../core/index.js";
import { ILogger, IService } from "../../types.js";
import { IsObject, IsString, ObjectContainsKey } from "../../lib.js";

export type TStreamEventServiceOptions = {
  callback: (event: TStreamEvent) => void;
  emitter?: EventTarget;
  logger?: ILogger;
};

export class StreamEventService
  implements IService<TStreamEventServiceOptions>
{
  options?: TStreamEventServiceOptions = undefined;
  bind: (...args: unknown[]) => void = () => {};
  eventListener: string = EStreamEventType.TS_TYPE;

  onEvent(data: unknown) {
    if (!IsObject(data))  return;
    if (!ObjectContainsKey(data, 'detail')) return;
    if (!IsObject(data.detail)) return;
    if (!ObjectContainsKey(data.detail, 'tstype')) return;
    if (!IsString(data.detail.tstype)) return;
    if (data.detail.tstype !== EStreamEventType.TS_TYPE)
      return undefined;
    
    //! By this point, we know that the event is likely a TStreamEvent
    this.options?.logger?.info("StreamEvent Service received event", data.detail);
    this.options?.callback(data.detail as TStreamEvent);
  }

  Start(options: TStreamEventServiceOptions): void {
    this.options = options;

    this.options.logger?.info("Starting StreamEvent Service");

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
      this.eventListener,
      this.bind
    );
  }

  Stop(): void {
    this.options?.logger?.info("Stopping StreamEvent Service");

    (this.options?.emitter ?? window).removeEventListener(
      this.eventListener,
      this.bind
    );
  }

  Restart(): void {
    this.options?.logger?.info("Restarting StreamEvent Service");
    this.Stop();
    if (!this.options) return;
    this.Start(this.options);
  }
}
