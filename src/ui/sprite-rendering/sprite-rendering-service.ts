import { IService, ILogger } from "../../types.js";

export type TSpriteRenderingServiceOptions = {
  logger: ILogger;
};

export class SpriteRenderingService
  implements IService<TSpriteRenderingServiceOptions>
{
  options: TSpriteRenderingServiceOptions | undefined = undefined;
  Start(options: TSpriteRenderingServiceOptions): void {
    this.options = options;
  }
  Stop(): void {}
  Restart(): void {
    this.Stop();
    if (!this.options) return;
    this.Start(this.options);
  }
}
