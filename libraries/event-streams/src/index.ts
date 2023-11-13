/// <reference lib="dom" />

import { Types } from '@aonyxbuddy/stream-events';

const connectionTimeout = 1000 * 3;

const auth = {
    type: 'handshake',
    application: 'aonyxbuddy',
    user: 'fariaorion',
    token: '1234567890'
};

function Link(
    ws: WebSocket,
    onopen: (event: Event) => void,
    onmessage: (event: MessageEvent) => void,
    onclose: (event: Event) => void) {

    ws.addEventListener('open', onopen);
    ws.addEventListener('message', onmessage);
    ws.addEventListener('close', onclose);
}

function Unlink(
    ws: WebSocket,
    onopen: (event: Event) => void,
    onmessage: (event: MessageEvent) => void,
    onclose: (event: Event) => void) {

    ws.removeEventListener('open', onopen);
    ws.removeEventListener('message', onmessage);
    ws.removeEventListener('close', onclose);
}

function Log(...args: any) {
    console.log('[WSSE]', ...args);
}

const maxFailedConnections: number = 5;
let failedCounter: number = 0;

export default function ListenForWebSocketStreamEvents(url: string, callback: (event: Types.StreamEvent) => void, loggingEnabled?: boolean): WebSocket {
    let ws = new WebSocket(url);

    function OnOpen() {
        if (loggingEnabled) Log(`connection opened with ${url}`);
        failedCounter -= 1;
        ws.send(JSON.stringify(auth));
    }

    function OnMessage(messageEvent: MessageEvent) {
        try {
            const json = JSON.parse(messageEvent.data);
            if (json.type === 'data') {
                callback(json.data);
            } else {
                if (loggingEnabled) Log(`not stream event ${url}\n${messageEvent.data ?? ''}`);
            }
        } catch (e) {
            if (loggingEnabled) Log(`failed packet from ${url}`);
            if (loggingEnabled) Log(`non json from ${url}\n${messageEvent.data ?? ''}`);
        }
    }

    function OnClose() {
        if (loggingEnabled) Log(`connection closed with ${url}`, failedCounter);

        failedCounter += 1;

        Unlink(ws, OnOpen, OnMessage, OnClose);

        if (failedCounter < maxFailedConnections + 1) {
            setTimeout(() => {
                ws = new WebSocket(url);
                Link(ws, OnOpen, OnMessage, OnClose);
            }, connectionTimeout);
        }
    }

    Link(ws, OnOpen, OnMessage, OnClose);

    return ws;
}
