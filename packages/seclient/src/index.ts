import * as StreamEvents from '@aonyxbuddy/streamevents';
import * as WebSockets from "@aonyxbuddy/websockets";

//declare let url: string;
const url = 'wss://api.aonyxlimited.com/ws/streamelements';

async function main() {
    const wsClient = new WebSockets.BrowserClient.BrowserWebSocketClient({ url: url, token: 'token goes here' });
    const seListener = new StreamEvents.Clients.StreamElementsEventListener();

    seListener.eventSubscription.subscribe((event) => {
        console.log('Sending >> ', event);
        wsClient.send(event);
    });
}

main();
