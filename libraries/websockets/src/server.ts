import { StreamEvent } from '@aonyxbuddy/stream-events';
interface WSData {
  token?: string,
  message?: string,
  streamEvent?: StreamEvent
}

const server = Bun.serve<WSData>({
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) {
      return undefined;
    }
    return new Response('Websocket protocol upgrade failed.', { status: 500 });
  },
  websocket: {
    async message(ws, message) {
      ws.data.token
      ws.send(`You said: ${message}`);
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);

