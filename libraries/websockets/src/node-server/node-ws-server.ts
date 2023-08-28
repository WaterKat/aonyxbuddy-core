import { default as WebSocket /*, Server  as WSServer */ } from 'ws';
import * as Subscriptions from '@aonyxbuddy/subscriptions';
import * as Deliveries from '../deliveries/index';

// import { IWSAuthData, IWSPacketData } from '../shared';

export interface INodeWebSocketServerOptions {
  path: string;
  checkToken: (token: string) => boolean;
}

export class NodeWebSocketServer
  implements Deliveries.IRoute<WebSocket>, Subscriptions.ISubscriptee<any>
{
  private options: INodeWebSocketServerOptions;

  subscription: Subscriptions.Subscription<any> = new Subscriptions.Subscription<any>();

  private wsList: WebSocket[] = [];

  private logging = true;
  private log(...args: any) {
    if (!this.logging) return;

    console.log('NWSServer >> ', ...args);
  }

  constructor(options: INodeWebSocketServerOptions) {
    this.options = options;
  }

  receiveRoll(roll: Deliveries.IRoll<WebSocket>): boolean {
    if (this.options.path !== roll.path) return false;

    this.connectWS(roll.contents);
    return true;
  }

  broadcast(data: any) {
    return this.wsList.forEach((ws: WebSocket) => {
      try {
        const message = JSON.stringify(data);
        ws.send(message);
      } catch (e) {
        ws.send(data.toString());
      }
    });
  }

  addWS(ws: WebSocket): boolean {
    if (this.wsList.includes(ws)) return false;

    this.wsList.push(ws);
    return true;
  }

  removeWS(ws: WebSocket): boolean {
    if (!this.wsList.includes(ws)) return false;

    const index: number = this.wsList.indexOf(ws);
    if (index > -1) {
      this.wsList.splice(index, 1);
      return true;
    }

    return false;
  }

  LinkWebSocket(ws: WebSocket) {
    ws.send('Connection established...');
    this.addWS(ws);

    const onMessageEvent = (event: WebSocket.MessageEvent) => {
      this.log('D:', event.data.toString());

      try {
        const parsed: any = JSON.parse(event.data.toString());
        this.subscription.invoke(parsed);
      } catch (e) {
        this.subscription.invoke(event.data.toString());
      }
    };

    ws.addEventListener('message', onMessageEvent);
  }

  AuthorizeWebSocket(ws: WebSocket) {
    ws.send('Please provide authorizations...');
    this.log("Requesting authorization....");

    const onMessageEvent = (event: WebSocket.MessageEvent) => {
      this.log('@:', event.data.toString());

      let parsed: any;
      try {
        parsed = JSON.parse(event.data.toString());
      } catch (e) {
        parsed = event.data.toString() || '';
      }

      if (!parsed) return;

      let authorizationValid: boolean = false;

      if (typeof parsed === 'string') {
        authorizationValid = this.options.checkToken(parsed);
      } else if (
        parsed.discriminator &&
        parsed.discriminator === 'IWSAuthData'
      ) {
        authorizationValid = this.options.checkToken(parsed.token);
      }

      if (authorizationValid) {
        ws.removeEventListener('message', onMessageEvent);
        this.LinkWebSocket(ws);
      }
    };

    ws.addEventListener('message', onMessageEvent);
  }

  connectWS(ws: WebSocket) {
    ws.addEventListener('error', (event: WebSocket.ErrorEvent) =>
      this.log('error >>', event.message),
    );

    ws.addEventListener('close', (event: WebSocket.CloseEvent) => {
      this.log('close >>', event.reason);
      this.removeWS(ws);
    });

    this.AuthorizeWebSocket(ws);
  }
}
