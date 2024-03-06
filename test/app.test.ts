import { EStreamEventType, TStreamEvent } from "../src/core/stream-events/types.js";

/*
if (typeof window.EStreamEventType === "undefined") {
    window.EStreamEventType = {
        TS_TYPE: "al-aonyxbuddy-data",
        FOLLOW: "follow",
        SUBSCRIBER: "subscriber",
        GIFT_SINGLE: "gift-single",
        GIFT_BULK_SENT: "gift-bulk-sent",
        GIFT_BULK_RECEIVED: "gift-bulk-received",
        RAID: "raid",
        CHEER: "cheer",
        CHAT: "chat",
        CHAT_FIRST: "chat-first",
        COMMAND: "command",
        REDEEM: "redeem",
        IGNORE: "ignore",
        OTHER: "other",
    };
}
*/

function SendEvent(event: TStreamEvent) {
    console.log("SendEvent", event);
    const newEvent = new CustomEvent(EStreamEventType.TS_TYPE, {
        detail: event,
    });
    window.dispatchEvent(newEvent);
}

const usernameInput = document.getElementById("ab_username") as HTMLInputElement;
const GetUsername = () => usernameInput.value;

const receiverInput = document.getElementById("ab_receiver") as HTMLInputElement;
const GetReceiver = () => receiverInput.value;

const chatInput = document.getElementById("ab_message") as HTMLInputElement;
const GetChat = () => chatInput.value;

// Send follow event
document
    .getElementById("ab_follow")
    ?.addEventListener("click", () => SendEvent(SendFollow()));
const SendFollow = (): TStreamEvent => ({
    tstype: EStreamEventType.TS_TYPE,
    type: EStreamEventType.FOLLOW,
    username: GetUsername(),
});

// Send subscriber event
document
    .getElementById("ab_subscriber")
    ?.addEventListener("click", () => SendEvent(SendSubscriber()));
const SendSubscriber = (): TStreamEvent => ({
    tstype: EStreamEventType.TS_TYPE,
    type: EStreamEventType.SUBSCRIBER,
    username: GetUsername(),
    length: Math.floor(Math.random() * 10),
    message: {
        text: GetChat(),
        emotes: [],
    },
});

// Send gift single event
document
    .getElementById("ab_gift_single")
    ?.addEventListener("click", () => SendEvent(SendGiftSingle()));
const SendGiftSingle = (): TStreamEvent => ({
    tstype: EStreamEventType.TS_TYPE,
    type: EStreamEventType.GIFT_SINGLE,
    username: GetUsername(),
    receiver: GetReceiver()
});

// Send gift bulk sent event
document
    .getElementById("ab_gift_bulk_sent")
    ?.addEventListener("click", () => SendEvent(SendGiftBulkSent()));
const SendGiftBulkSent = (): TStreamEvent => ({
    tstype: EStreamEventType.TS_TYPE,
    type: EStreamEventType.GIFT_BULK_SENT,
    username: GetUsername(),
    count: Math.floor(Math.random() * 10),
});

// Send gift bulk received event
document
    .getElementById("ab_gift_bulk_received")
    ?.addEventListener("click", () => SendEvent(SendGiftBulkReceived()));
const SendGiftBulkReceived = (): TStreamEvent => ({
    tstype: EStreamEventType.TS_TYPE,
    type: EStreamEventType.GIFT_BULK_RECEIVED,
    username: GetUsername(),
    receiver: GetReceiver(),
});

// Send raid event
document
    .getElementById("ab_raid")
    ?.addEventListener("click", () => SendEvent(SendRaid()));
const SendRaid = (): TStreamEvent => ({
    tstype: EStreamEventType.TS_TYPE,
    type: EStreamEventType.RAID,
    username: GetUsername(),
    count: Math.floor(Math.random() * 10),
});

// Send cheer event
document
    .getElementById("ab_cheer")
    ?.addEventListener("click", () => SendEvent(SendCheer()));
const SendCheer = (): TStreamEvent => ({
    tstype: EStreamEventType.TS_TYPE,
    type: EStreamEventType.CHEER,
    username: GetUsername(),
    amount: Math.floor(Math.random() * 100),
    message: {
        text: GetChat(),
        emotes: [],
    },
});

// Send chat event
document
    .getElementById("ab_chat")
    ?.addEventListener("click", () => SendEvent(SendChat()));
const SendChat = (): TStreamEvent => ({
    tstype: EStreamEventType.TS_TYPE,
    type: EStreamEventType.CHAT,
    username: GetUsername(),
    message: {
        text: GetChat(),
        emotes: [],
    },
});

// Send redeem event
document
    .getElementById("ab_redeem")
    ?.addEventListener("click", () => SendEvent(SendRedeem()));
const SendRedeem = (): TStreamEvent => ({
    tstype: EStreamEventType.TS_TYPE,
    type: EStreamEventType.REDEEM,
    username: GetUsername(),
    id: "test",
    message: {
        text: GetChat(),
        emotes: [],
    },
});

// Link Text
import GetAonyxBuddyStreamEventListener
    from "../src/stream-event-listener/index.js";

const responsesContainer = document
    .getElementById("ab_responses_container") as HTMLDivElement;

const AddResponse = (response: string) => {
    const p = document.createElement("p");
    p.innerText = response;
    responsesContainer.insertBefore(p, responsesContainer.firstChild);
}

GetAonyxBuddyStreamEventListener((event) => {
    AddResponse(JSON.stringify(event));
});