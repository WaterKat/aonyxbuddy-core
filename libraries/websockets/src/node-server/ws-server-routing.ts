import {default as WS, WebSocketServer} from 'ws';
import * as HTTP from 'http';
import * as URL from 'url';

import * as Deliveries from '../deliveries/index.js';

export class WebSocketDeliveryStation
  implements Deliveries.IDeliveryStation<WS>
{
  ws: WebSocketServer;
  private routes: Deliveries.IRoute<WS>[] = [];

  constructor(server: HTTP.Server) {
    this.ws = new WebSocketServer({ server });

    this.ws.on('connection', (ws: WS, req: HTTP.IncomingMessage) => {
      console.log('connection attempted');
      const defaultPath = '/';
      const path = req.url
        ? URL.parse(req.url, true).pathname ?? defaultPath
        : defaultPath;

      const roll: Deliveries.IRoll<WS> = {
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

  addRoute(route: Deliveries.IRoute<WS>) {
    console.log('adding route', JSON.stringify(route));
    if (this.routes.includes(route)) {
      return false;
    }

    this.routes.push(route);
    return true;
  }
}

export class WebSocketDeliverer
  implements Deliveries.IDeliverer<WS>
{
  private path: string;
  private routes: Deliveries.IRoute<WS>[] = [];

  constructor(path: string) {
    this.path = path;
    console.log('You created a path', path);

    if (!path.startsWith('/')) {
      console.warn(
        `Path ${path} did not begin with a forward slash (/). One will be prefixed`,
      );
      this.path = '/' + this.path;
    }
  }

  addRoute(route: Deliveries.IRoute<WS>) {
    console.log('adding route', JSON.stringify(route));
    if (this.routes.includes(route)) {
      return false;
    }

    this.routes.push(route);
    return true;
  }

  receiveRoll(roll: Deliveries.IRoll<WS>): boolean {
    console.log('receiving roll ', roll.path, this.path); //, JSON.stringify(roll));

    if (!roll.path.startsWith(this.path)) return false;

    const newPath = roll.path.substring(this.path.length);

    const newRoll: Deliveries.IRoll<WS> = {
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
