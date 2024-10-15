export interface IService<TOptions> {
  Start(options: TOptions): void;
  Stop(): void;
  Restart(): void;
}

export interface ILogger {
  log: (...data: unknown[]) => void;
  warn: (...data: unknown[]) => void;
  error: (...data: unknown[]) => void;
  info: (...data: unknown[]) => void;
  debug: (...data: unknown[]) => void;
}


