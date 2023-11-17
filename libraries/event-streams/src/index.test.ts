import ListenForWebSocketStreamEvents from "./listener.js";

const url = `ws://localhost:3000/api/v1/ws/asdf`

function main() {
    function print(obj: any) {
        console.log(JSON.stringify(obj));
    }

    const listener = ListenForWebSocketStreamEvents(url, print, true);
    if (listener instanceof Error) {
        throw (listener);
    };

    setInterval(() => {
        if (listener.OPEN) {
            listener.send('{"message":"hello world!"}');
        }
    }, 1000 * 1);
}

main();
