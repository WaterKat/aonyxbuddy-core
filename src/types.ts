export interface IService {
  Start(...options: unknown[]): void | Promise<void>;
  Stop(): void | Promise<void>;
  Restart(): void | Promise<void>;
}

export interface ILogger {
  log: (...data: unknown[]) => void;
  warn: (...data: unknown[]) => void;
  error: (...data: unknown[]) => void;
  info: (...data: unknown[]) => void;
  debug: (...data: unknown[]) => void;
}


