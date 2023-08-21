import { Subscription } from "@aonyxbuddy/subscriptions";

import { StreamEvent } from "../../../stream-events/stream-event";

export class WebSocketStreamEventListener {
    static ReconnectTimeoutInSeconds = 3;
    static ReconnectAttemptCount = 3;

    eventSubscription = new Subscription<StreamEvent>()
    ws!: WebSocket;

    connectWS(_token: string, _url: string) {
        this.ws = new WebSocket(_url);

        this.ws.onopen = () => {
            const authMessage = {
                authorization_token: _token
            }
            this.ws.send(JSON.stringify(authMessage));
        }

        this.ws.onerror = (_event: Event) => {
            console.error(_event);
        };

        this.ws.onmessage = (_event: MessageEvent) => {
            const message: StreamEvent = JSON.parse(_event.data);
            if (message) {
                this.eventSubscription.invoke(message);
            }
        };

        this.ws.onclose = (_event: Event) => {
            console.error(_event);
            console.error('Attempting to reconnect to ws...');
            
            setTimeout(() => {
                this.connectWS(_token, _url);
            }, 1000 * WebSocketStreamEventListener.ReconnectTimeoutInSeconds);
        }
    }

    constructor(_token: string = '', _url: string = 'wss://api.aonyxlimited.com/ws/twitch') {
        this.connectWS(_token, _url);
    }

}
