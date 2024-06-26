const PORT : number = 3010;
const HOSTNAME : string = 'localhost';

const server = Bun.serve({
    fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/") {
            url.pathname = "index.html";
        }
        
        const filePath = "./docs" + url.pathname;
        return new Response(Bun.file(filePath));
    },
    port: PORT,
    hostname: HOSTNAME
});

console.log(`Listening on ${server.hostname}:${server.port}`)
