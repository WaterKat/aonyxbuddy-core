import { default as WebSocket /*, Server  as WSServer */ } from 'ws';
import * as HTTP from 'http';
import * as URL from 'url';

import * as Deliveries from '../deliveries/index.js';

//import { Tools } from '../external.js';

export class WebSocketDeliveryStation
  implements Deliveries.IDeliveryStation<WebSocket>
{
  ws: WebSocket.Server;
  private routes: Deliveries.IRoute<WebSocket>[] = [];

  constructor(server: HTTP.Server) {
    this.ws = new WebSocket.Server({ server });

    this.ws.on('connection', (ws: WebSocket, req: HTTP.IncomingMessage) => {
      console.log('connection attempted');
      const defaultPath = '/';
      const path = req.url
        ? URL.parse(req.url, true).pathname ?? defaultPath
        : defaultPath;

      const roll: Deliveries.IRoll<WebSocket> = {
        path,
        contents: ws,
      };

      const routeFound: boolean =
        this.routes.some((route) => {
          return route.receiveRoll(roll);
        }) || false;

      if (!routeFound) ws.close();
    });
  }

  addRoute(route: Deliveries.IRoute<WebSocket>) {
    console.log('adding route', JSON.stringify(route));
    if (this.routes.includes(route)) {
      return false;
    }

    this.routes.push(route);
    return true;
  }
}

export class WebSocketDeliverer
  implements Deliveries.IDeliverer<WebSocket>
{
  private path: string;
  private routes: Deliveries.IRoute<WebSocket>[] = [];

  constructor(path: string) {
    this.path = path;

    if (!path.startsWith('/')) {
      console.warn(
        `Path ${path} did not begin with a forward slash (/). One will be prefixed`,
      );
      this.path = '/' + this.path;
    }
  }

  addRoute(route: Deliveries.IRoute<WebSocket>) {
    console.log('adding route', JSON.stringify(route));
    if (this.routes.includes(route)) {
      return false;
    }

    this.routes.push(route);
    return true;
  }

  receiveRoll(roll: Deliveries.IRoll<WebSocket>): boolean {
    console.log('receiving roll ', roll.path, this.path); //, JSON.stringify(roll));

    if (!roll.path.startsWith(this.path)) return false;

    const newPath = roll.path.substring(this.path.length);

    const newRoll: Deliveries.IRoll<WebSocket> = {
      ...roll,
      path: newPath,
    };

    const routeFound: boolean =
      this.routes.some((route) => {
        return route.receiveRoll(newRoll);
      }) || false;

    return routeFound;
  }
}
