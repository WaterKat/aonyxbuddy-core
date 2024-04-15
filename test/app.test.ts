import {
  EStreamEventType, TStreamEvent
} from "../src/core/stream-events/types.js";

function SendEvent(event: TStreamEvent) {
  const newEvent = new CustomEvent(EStreamEventType.TS_TYPE, {
    detail: event,
  });
  window.dispatchEvent(newEvent);
}

const usernameInput = document
  .getElementById("ab_username") as HTMLInputElement;
const GetUsername = () => usernameInput.value;

const receiverInput = document
  .getElementById("ab_receiver") as HTMLInputElement;
const GetReceiver = () => receiverInput.value;

const chatInput = document
  .getElementById("ab_message") as HTMLInputElement;
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
  ProcessEvent,
  StatefulProcessFirstChat,
  IStatefulFirstEventArgs,
  StatefulProcessIgnoreRaid,
  IStatefulIgnoreRaidArgs
} from "../src/core/stream-events/index.js";

let impureProcessedEvent: TStreamEvent = {} as any;

let firstChatOptions: IStatefulFirstEventArgs = {
  event: {} as any,
  options: {},
  state: {
    chatters: []
  }
}

let raidOptions: IStatefulIgnoreRaidArgs = {
  event: {} as any,
  options: {
    ignoreTimeInSeconds: 30,
    ignore: [
      EStreamEventType.CHAT_FIRST,
      EStreamEventType.FOLLOW
    ]
  },
  state: {
    lastRaid: new Date(0)
  }
}

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

  const processedEvent: TStreamEvent =
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

  // impure
  firstChatOptions.event = processedEvent;
  firstChatOptions = StatefulProcessFirstChat(firstChatOptions);
  raidOptions.event = firstChatOptions.event;
  raidOptions = StatefulProcessIgnoreRaid(raidOptions);
  impureProcessedEvent = raidOptions.event;

  const response = GetStreamEventResponse(
    impureProcessedEvent,
    {
      responses: config.responses["voice"],
      key: impureProcessedEvent.type,
      randomBetween01Func: () => Math.random()
    }
  );

  if (response.length > 0) {
    AddResponse(response);
  }
});

/**
 * Sprite Rendering Example
 * 
 * This example demonstrates how to render sprites on a canvas using the
 * sprite-rendering module.
 * 
 * The sprite-rendering module is a wrapper around the canvas rendering API
 * that simplifies the process of rendering sprites on a canvas. The user
 * provides a configuration with urls that represent the sprites to be rendered
 * and a delta between the provided min and max, and the module will render the
 * sprite that is closest to the provided delta.
 * 
 * Each sprite array has it's own configuration, and the user can provide
 * individual deltas for each sprite array. The module will render the sprite
 * that is closest to the provided delta for each sprite array, in order from
 * the first sprite array to the last. 
 * * Note: this means that the last sprite will be rendered last, and will be 
 * * on top of the other sprites.
 */

/*
import {
  InitializeRenderer,
  RenderParams
} from "../src/ui/sprite-rendering/index.js";

const spriteRendering = (async () => {
  let loopEnabled = true;

  const renderingData = {
    populatedConfig: await InitializeRenderer(config.spriteRendering),
    Stop: () => loopEnabled = false
  };

  if (!renderingData.populatedConfig) return;

  async function RenderLoop() {
    if (!renderingData.populatedConfig) return;
    if (!loopEnabled) return;

    renderingData.populatedConfig.config.params.map(
      (params, index) => {
        params.value += 0.1;
        if (params.value > 1)
          params.value -= 1;
      });

    RenderParams(
      renderingData.populatedConfig.ctx,
      renderingData.populatedConfig.config
    );

    await new Promise<void>(resolve => setTimeout(resolve, 100));

    requestAnimationFrame(RenderLoop);
  }

  RenderLoop();

  return renderingData;
})();

setTimeout(async () => {
  const renderingData = await spriteRendering;
  if (!renderingData) return;
  renderingData.Stop();
}, 5000);
*/