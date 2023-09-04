import { default as Express } from 'express';
import * as HTTP from 'http';

import * as WebSockets from '@aonyxbuddy/websockets';

function main() {
    const app = Express();
    const server = HTTP.createServer(app);

    const deliveryStation = new WebSockets.Server.WebSocketDeliveryStation(server);

    const route = new WebSockets.Server.WebSocketDeliverer('/api');
    deliveryStation.addRoute(route);

    const seserver = new WebSockets.Server.NodeWebSocketServer({
        path: '/streamelements',
        checkToken: () => true
    });
    route.addRoute(seserver);

    seserver.subscription.subscribe((anyObject : any) => {
        console.log('any received << ', anyObject);
        if (anyObject.type && anyObject.username){
            seserver.broadcast(anyObject);
        }
    });

    const port = process.argv[2];
    server.listen(port, () => {
        console.log(`Listening on port ${port}`)
    });
}

main();