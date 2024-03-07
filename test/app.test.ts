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

import { GetStreamEventResponse } from "../src/core/responses/index.js";
import {
    ClientConfigExample as config
} from "../src/config/iclient-config-fariaorion.test.js";
import { 
    IUserPermissions,
    EPermissionLevel,
    ProcessEvent
} from "../src/core/stream-events/processing/index.js";

GetAonyxBuddyStreamEventListener((rawEvent: TStreamEvent) => {
    const permissions: IUserPermissions = {
        [rawEvent.username]: rawEvent.permissions ?
          rawEvent.permissions.streamer ? EPermissionLevel.STREAMER :
            rawEvent.permissions.moderator ? EPermissionLevel.MODERATOR :
              rawEvent.permissions.vip ? EPermissionLevel.VIP :
                rawEvent.permissions.subscriber ? EPermissionLevel.SUBSCRIBER :
                  rawEvent.permissions.follower ? EPermissionLevel.FOLLOWER :
                    EPermissionLevel.CHATTER
          : EPermissionLevel.CHATTER
      };
  
      const event: TStreamEvent =
        ProcessEvent(rawEvent, {
          FilterWordsCaseInsensitiveOptions: {
            wordsToFilter: config.blockedWords,
            replacement: "ploop"
          },
          FilterWordsCaseSensitiveOptions: {
            wordsToFilter: [],
            replacement: "ploop"
          },
          CommandOptions: {
            identifiers: ["!aonyxbuddy"],
            actions: ["debug", "say", "mute", "unmute", "skip"]
          },
          GetNicknameOptions: {
            nicknameMap: config.nicknames,
            randomBetween01Func: () => Math.random()
          },
          FilterBlacklistOptions: {
            blacklist: config.blacklist
          },
          FilterEmojisOptions: {
            replacement: ""
          },
          FilterBotlistOptions: {
            botlist: config.botlist,
            allow: [EStreamEventType.COMMAND]
          },
          FilterPermissionsOptions: {
            permissionRequirements: {
              [EStreamEventType.TS_TYPE]: EPermissionLevel.CHATTER,
              [EStreamEventType.CHAT]: EPermissionLevel.CHATTER,
              [EStreamEventType.CHAT_FIRST]:
                EPermissionLevel.FOLLOWER,
              [EStreamEventType.CHEER]: EPermissionLevel.CHATTER,
              [EStreamEventType.SUBSCRIBER]:
                EPermissionLevel.CHATTER,
              [EStreamEventType.FOLLOW]: EPermissionLevel.CHATTER,
              [EStreamEventType.RAID]: EPermissionLevel.CHATTER,
              [EStreamEventType.GIFT_BULK_RECEIVED]:
                EPermissionLevel.CHATTER,
              [EStreamEventType.GIFT_BULK_SENT]:
                EPermissionLevel.CHATTER,
              [EStreamEventType.GIFT_SINGLE]:
                EPermissionLevel.CHATTER,
              [EStreamEventType.COMMAND]: EPermissionLevel.MODERATOR,
              [EStreamEventType.REDEEM]: EPermissionLevel.CHATTER,
              [EStreamEventType.IGNORE]: EPermissionLevel.CHATTER,
              [EStreamEventType.OTHER]: EPermissionLevel.CHATTER,
            },
            permissions: permissions
          },
          FilterCheermotesOptions: {
            replacement: " "
          },
          FilterConditionOptions: {
            condition: true,
          }
        });
    
        console.log("Raw:", rawEvent, "Processed: ", event);

    const response = GetStreamEventResponse(
        event,
        {
          responses: config.responses["voice"],
          key: event.type,
          randomBetween01Func: () => Math.random()
        }
    );
    if (response.length > 0) {
        AddResponse(response);
    }
});
