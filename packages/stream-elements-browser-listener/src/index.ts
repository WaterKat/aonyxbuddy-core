import * as StreamEvents from '@aonyxbuddy/streamevents';
import * as WebSockets from "@aonyxbuddy/websockets";

//declare let url: string;
const wsURL = 'wss://ws.aonyxlimited.com/api/streamelements';
console.log("attempting to connect to ", wsURL);

async function main() {
    const wsClient = new WebSockets.BrowserClient.BrowserWebSocketClient({ url: wsURL, token: 'token goes here' });
    const seListener = new StreamEvents.Clients.StreamElementsEventListener();

    seListener.eventSubscription.subscribe((event) => {
        console.log('Sending >> ', event);
        wsClient.send(event);
    });
}

main();
