const server = Bun.serve({
    fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/") {
            url.pathname = "index.html";
        }
        
        const filePath = "./out" + url.pathname;
        return new Response(Bun.file(filePath));
    },
    port: 3000
});

console.log(`Listening on ${server.hostname}:${server.port}`)