export interface IService {
  Start(...options: unknown[]): void | Promise<void>;
  Stop(): void | Promise<void>;
  Restart(): void | Promise<void>;
}


//MARK: Loggers
export interface ILogger {
  log: (...data: unknown[]) => void;
  warn: (...data: unknown[]) => void;
  error: (...data: unknown[]) => void;
  info: (...data: unknown[]) => void;
  debug: (...data: unknown[]) => void;
}

type TaggedLoggerOptions = {
  logger: ILogger;
  tag?: string;
  brackets?: boolean;
  timestamp?: boolean;
  logType?: boolean;
};

export class TaggedLogger implements ILogger {
  options: TaggedLoggerOptions;

  constructor(options: TaggedLoggerOptions) {
    this.options = options;
  }

  processTag(type: keyof ILogger): string {
    const date = this.options.timestamp ? new Date().toISOString() : "";
    const dateBreak = this.options.timestamp ? " " : "";
    const tag = this.options.tag ? this.options.tag : "";
    const bracket1 = this.options.brackets ? "[" : "";
    const bracket2 = this.options.brackets ? "]" : "";
    const logBreak = this.options.logType ? " | " : "";
    const logType = this.options.logType ? type.toUpperCase() : "";
    return `${bracket1}${date}${dateBreak}${tag}${logBreak}${logType}${bracket2}`;
  }

  log(...data: unknown[]): void {
    this.options.logger.log(this.processTag("log"), ...data);
  }
  warn(...data: unknown[]): void {
    this.options.logger.warn(this.processTag("warn"), ...data);
  }
  error(...data: unknown[]): void {
    this.options.logger.error(this.processTag("error"), ...data);
  }
  info(...data: unknown[]): void {
    this.options.logger.info(this.processTag("info"), ...data);
  }
  debug(...data: unknown[]): void {
    this.options.logger.debug(this.processTag("debug"), ...data);
  }
}
