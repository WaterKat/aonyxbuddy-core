import {
  IWSAuthData, 
  /*, IWSPacketData, IWSType, ParseStringToWSType */
} from '../shared/index';

import * as Subscriptions from '@aonyxbuddy/subscriptions';

export interface IBrowserWebSocketClientOptions {
  token: string;
  url: string;
}

export class BrowserWebSocketClient implements Subscriptions.ISubscriptee<any> {
  private reconnectIntervalInSeconds: number = 3;
  private reconnectAttempts: number = -1;
  private options: IBrowserWebSocketClientOptions;
  private logging: boolean = true;

  private ws!: WebSocket;

  private attemptCount = 0;

  public subscription: Subscriptions.Subscription<any> = new Subscriptions.Subscription<any>();

  constructor(options: IBrowserWebSocketClientOptions) {
    this.options = options;
    this.connectWS(options.url, options.token);
  }

  log(...args: any) {
    if (!this.logging) return;
    console.log('BWSClient >', args);
  }

  send(data: any): boolean {
    if (!this.ws) return false;

    try {
      const message = JSON.stringify(data);
      this.ws.send(message);
      return true;
    } catch (e) {
      this.ws.send(data.toString());
      return true;
    }
  }

  connectWS(_url: string, _token: string) {
    if (
      this.reconnectAttempts >= 0 &&
      this.attemptCount > this.reconnectAttempts
    ) {
      this.log('Max reconnect attempts reached.');
      this.attemptCount = -1;
      return;
    }

    let ping : ReturnType<typeof setInterval>;

    this.ws = new WebSocket(_url);

    this.ws.onopen = () => {
      this.log('WebSocket connection established...');

      const authMessage: IWSAuthData = {
        discriminator: 'IWSAuthData',
        token: _token,
      };

      this.ws.send(JSON.stringify(authMessage));

      ping = setInterval(() => {
        this.ws.send('Ping');
      }, 1000 * 55);
    };

    this.ws.onerror = (_event: Event) => console.error(_event);

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const parsed: any = JSON.parse(event.data);
        this.subscription.invoke(parsed);
      } catch (e) {
        this.log('message >', event.data);
      }
    };

    this.ws.onclose = (_event: CloseEvent) => {
      this.log(_event.reason);
      this.log('Connection failed. Attempting to reconnect...');

      clearInterval(ping);

      const reconnectTimeout = setTimeout(() => {
        if (this.attemptCount < 0) {
          clearInterval(reconnectTimeout);
          return;
        }
        this.attemptCount += 1;
        this.log(
          `Reconnect attempt ${this.attemptCount} of ${this.reconnectAttempts}...`,
        );
        this.connectWS(this.options.url, this.options.token);
      }, 1000 * this.reconnectIntervalInSeconds);
    };
  }
}
