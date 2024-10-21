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

export type TProcessStreamEventOptions = {
  logger: ILogger;
  config: ILegacyConfig | ProcessEventOptions;
};

export class ProcessStreamEventService implements IService {
  options: TProcessStreamEventOptions;
  processEventFunction: (event: TStreamEvent) => Logger<TStreamEvent>;

  constructor(options: TProcessStreamEventOptions) {
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