import {
  //IClientConfig,
  ILogger,
  IService,
} from "./index.js";

export type TAonyxBuddyClientState = {
  [key: string]: unknown;
};

export type TAonyxBuddyWebClientOptions = {
  logger: ILogger;
  loadConfig: () => Promise<IClientConfig>;
  saveConfig: (config: IClientConfig) => Promise<void>;
  loadState: () => Promise<TAonyxBuddyClientState>;
  saveState: (state: TAonyxBuddyClientState) => Promise<void>;
};

export class AonyxBuddyWebClient
  implements IService<TAonyxBuddyWebClientOptions>
{
  options: TAonyxBuddyWebClientOptions | undefined = undefined;
  Start(options: TAonyxBuddyWebClientOptions): void {
    this.options = options;
  }
  Stop(): void {}
  Restart(): void {
    this.Stop();
    if (!this.options) return;
    this.Start(this.options);
  }
}
