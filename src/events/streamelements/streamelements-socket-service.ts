import { TStreamEvent } from "../../core/index.js";
import { IsObject, ObjectContainsKey } from "../../lib.js";
import { ILogger, IService } from "../../types.js";
import { io, type Socket } from "socket.io-client";
import EventTranslator from "../streamelements/event-translator.js";

export type TStreamElementsSocketServiceOptions = {
  getJWT: () => Promise<string>;
  callback?: (event: TStreamEvent) => void;
  outputEmitter?: EventTarget;
  listenToTestEvents?: boolean;
  logger?: ILogger;
};

export class StreamElementsSocketService
  implements IService<TStreamElementsSocketServiceOptions>
{
  options?: TStreamElementsSocketServiceOptions = undefined;
  bind: (...args: unknown[]) => void = () => {};
  eventListener: string = "onEventReceived";
  socket?: Socket;
  shouldRestart: boolean = false;

  onEvent(_event: unknown) {
    console.log("onEvent", _event);
    if (
      !IsObject(_event) ||
      !ObjectContainsKey(_event, "type") ||
      !ObjectContainsKey(_event, "data") ||
      !IsObject(_event.data) ||
      !ObjectContainsKey(_event.data, "username")
    ) {
      this.options?.logger?.error("Invalid StreamElements Event");
      return;
    }

    const rawEvent = {
      ..._event.data,
      type: _event.type === "follow" ? "follower" : _event.type,
      name: _event.data.username,
    };

    const streamEvent = EventTranslator(rawEvent, this.options?.logger);
    if (!streamEvent) {
      this.options?.logger?.error("Failed to Translate StreamElements Event");
      return;
    }

    if (this.options?.callback) {
      this.options?.callback(streamEvent);
    }

    if (this.options?.outputEmitter) {
      this.options.outputEmitter.dispatchEvent(
        new CustomEvent(this.eventListener, { detail: rawEvent })
      );
    }
  }

  Start(options: TStreamElementsSocketServiceOptions): void {
    this.options = options;

    this.options.logger?.info("Starting StreamElementsWebsocket Service");

    this.shouldRestart = true;

    this.options
      .getJWT()
      .then((jwt) => {
        this.socket = io("https://realtime.streamelements.com", {
          transports: ["websocket"],
        });

        this.socket.on("connect", () => {
          this.options?.logger?.info("Connected to StreamElements Socket");
          this.socket?.emit("authenticate", { method: "jwt", token: jwt });
        });

        this.socket.on("disconnect", () => {
          this.options?.logger?.info("Disconnected from StreamElements Socket");
          if (this.shouldRestart) this.Restart();
        });

        this.socket.on("authenticated", () => {
          this.options?.logger?.info("Authenticated to StreamElements Socket");
        });

        this.socket.on("unauthorized", (error: unknown) => {
          this.options?.logger?.error(error);
          this.Stop();
        });

        this.socket.on("event", (data: unknown) => {
          this.onEvent(data);
        });

        if (this.options?.listenToTestEvents) {
          this.socket.on("event:test", (data: unknown) => {
            this.onEvent(data);
          });
        }
      })
      .catch((error) => {
        this.options?.logger?.error("Failed to Load Token", error);
        this.Stop();
      });
  }

  Stop(): void {
    this.options?.logger?.info("Stopping StreamEvent Service");
    this.shouldRestart = false;
    this.socket?.disconnect();
    this.socket = undefined;
  }

  Restart(): void {
    this.options?.logger?.info("Restarting StreamEvent Service");
    this.Stop();
    if (!this.options) return;
    this.Start(this.options);
  }
}
