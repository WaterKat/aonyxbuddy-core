import { TStreamEvent, EStreamEventType } from "../../core/index.js";
import { ILogger, IService } from "../../types.js";
import { IsObject, IsString, ObjectContainsKey } from "../../lib.js";

export type TAonyxBuddyEventServiceOptions = {
  callback: (event: TStreamEvent) => void;
  inputEmitter: EventTarget | Window;
  logger?: ILogger;
};

export class AonyxBuddyEventService
  implements IService<TAonyxBuddyEventServiceOptions>
{
  options?: TAonyxBuddyEventServiceOptions = undefined;
  bind: (...args: unknown[]) => void = () => {};
  eventListener: string = EStreamEventType.TS_TYPE;

  onEvent(data: unknown) {
    if (!IsObject(data)) return;
    if (!ObjectContainsKey(data, "detail")) return;
    if (!IsObject(data.detail)) return;
    if (!ObjectContainsKey(data.detail, "tstype")) return;
    if (!IsString(data.detail.tstype)) return;
    if (data.detail.tstype !== EStreamEventType.TS_TYPE) return undefined;

    //! By this point, we know that the event is likely a TStreamEvent
    this.options?.logger?.info(
      "StreamEvent Service received event",
      data.detail
    );
    this.options?.callback(data.detail as TStreamEvent);
  }

  Start(options: TAonyxBuddyEventServiceOptions): void {
    this.options = options;

    this.options.logger?.info("Starting StreamEvent Service");

    this.bind = this.onEvent.bind(this);

    this.options?.inputEmitter.addEventListener(this.eventListener, this.bind);
  }

  Stop(): void {
    this.options?.logger?.info("Stopping StreamEvent Service");

    (this.options?.inputEmitter ?? window).removeEventListener(
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
