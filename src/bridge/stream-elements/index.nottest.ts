import * as StreamElements from "./index.js";

function main() {
    StreamElements.default((StreamEvent) => {
        console.log("Event Received, this is a test", StreamEvent);
    });
}

main();