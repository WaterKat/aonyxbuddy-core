import { ILogger } from "../types";
import { GetStreamEventResponse } from "./responses/get-stream-event-response.js";
import { TStreamEvent } from "./stream-events";

export type TReponseServiceOptions = {
  logger: ILogger
  responses: Record<string, string[]>
}

export class ResponseService {
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
}