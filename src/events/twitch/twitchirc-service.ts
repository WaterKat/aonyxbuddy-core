import tmi, { Client } from "tmi.js";
import { IService, ILogger } from "../../types.js";
import { TStreamEvent } from "../../core/index.js";
import { TranslateStreamElementsEventToAonyxEvent } from "../streamelements/translate-event-to-aonyxbuddy.js";

//MARK: Twitch IRC Service Options
export type TTwitchIRCServiceOptions = {
  logger?: ILogger;
  getChannel: (() => string) | (() => Promise<string>);
  callback: (event: TStreamEvent) => void;
};

//MARK: Twitch IRC Service
export class TwitchIRCService implements IService {
  client: Client | undefined;
  options: TTwitchIRCServiceOptions;
  attemptToReconnect: boolean = true;

  constructor(options: TTwitchIRCServiceOptions) {
    this.options = options;
  }

  //MARK: Start
  async Start() {
    //? Disconnect if already connected
    await this.Stop();

    const channel = await this.options.getChannel();

    //? Create new client
    this.client = new tmi.Client({
      channels: [channel],
    });

    this.client.connect();

    //MARK:connected
    this.client.on("connected", () => {
      this.options.logger?.info("Connected.");

      //? Connection successful, set reconnect flag
      this.attemptToReconnect = true;
    });

    //MARK:disconnected
    this.client.on("disconnected", (err) => {
      this.options.logger?.warn("Disconnected: ", err);

      if (this.attemptToReconnect) this.Restart();
    });

    //MARK:message
    this.client.on("message", (channel, tags, message /* , self */) => {
      const data = {
        type: "message",
        data: {
          nick: tags["username"],
          displayName: tags["display-name"],
          text: message,
          emotes: [],
          tags: {
            ...tags,
            vip: tags["vip"] ? "1" : "0",
            mod: tags["mod"] ? "1" : "0",
            subscriber: tags["subscriber"] ? "1" : "0",
          },
          channel: channel.replace("#", ""),
        },
      };

      if (this.options.logger)
        this.options.logger.info(
          `${tags["display-name"]}: ${message}`,
          JSON.stringify(data)
        );

      const translatedEvent = TranslateStreamElementsEventToAonyxEvent(data);
      if (!translatedEvent) {
        this.options.logger?.error("Failed to Translate StreamElements Event");
        return;
      }

      this.options.callback(translatedEvent);
    });
  }

  //MARK: Stop
  Stop(): void {
    this.client?.disconnect();
    this.client = undefined;

    //? Clear reconnect flag
    this.attemptToReconnect = false;
  }

  //MARK: Restart
  Restart(): void {
    this.Stop();
    this.Start();
  }
}
