import { ILogger, IService } from "../types";
import { GetStreamEventResponse } from "./responses/get-stream-event-response.js";
import { TStreamEvent } from "./stream-events";

export type TReponseServiceOptions = {
  logger: ILogger
  responses: Record<string, string[]>
}

export class ResponseService implements IService {
  options: TReponseServiceOptions;

  constructor(options: TReponseServiceOptions) {
    this.options = options;
  }

  GetResponse(event: TStreamEvent): string {
    return GetStreamEventResponse(event, {
      responses: this.options.responses,
      key: event.type,
      randomBetween01Func: Math.random
    })
  }

  Start(): void {}
  Stop(): void {}
  Restart(): void {}
}