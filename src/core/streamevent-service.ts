import { ILogger, IService } from "../types";
import {
  ILegacyConfig,
  ConvertLegacyProcessorConfig,
  IsLegacyEventProcessorConfig,
} from "./stream-events/legacy-support";
import {
  GetProcessEventFunction,
  ProcessEventOptions,
  TStreamEvent,
} from "./stream-events";
import { Logger } from "./stream-events/logger-monad";

export type TStreamEventOptions = {
  logger: ILogger;
  config: ILegacyConfig | ProcessEventOptions;
};

export class StreamEventService implements IService {
  options: TStreamEventOptions;
  processEventFunction: (event: TStreamEvent) => Logger<TStreamEvent>;

  constructor(options: TStreamEventOptions) {
    this.options = options;
    this.processEventFunction = GetProcessEventFunction(
      IsLegacyEventProcessorConfig(options.config)
        ? ConvertLegacyProcessorConfig(options.config)
        : options.config
    );
  }

  processEvent(event: TStreamEvent): TStreamEvent {
    const logged = this.processEventFunction(event);
    if (this.options.logger) this.options.logger.info(logged.getLogs());
    return logged.getValue();
  }

  Start(): void {}
  Stop(): void {}
  Restart(): void {}
}
