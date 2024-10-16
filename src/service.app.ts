import { ObjectContainsKey } from "./lib.js";
import { AonyxBuddyWebClient, TAonyxBuddyWebClientOptions } from "./service.js";

const options: TAonyxBuddyWebClientOptions = {
  logger: console,
  streamEventService: {
    logger: console,
    callback: (e) => console.log("SES",e),
    inputEmitter: window,
  },
  streamElementsOptions: {
    logger: console,
    callback: e => console.log("SE", e),
    inputEmitter: window,
  },
  streamElementsSocketOptions: {
    logger: console,
    listenToTestEvents: true,
    getJWT: async () => {
      if (!ObjectContainsKey(import.meta, "env")) throw new Error("env not found");
      const token =  (import.meta as unknown as {env:{[key: string]: string}}).env.VITE_SE_JWT ?? "";
      return token;
    },
    callback: e => console.log("SES", e),
    outputEmitter: undefined,
  },
};

const client = new AonyxBuddyWebClient();
client.Start(options);

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    client.Stop();
  });
}
