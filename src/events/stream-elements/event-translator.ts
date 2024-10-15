import * as Types from "../../core/stream-events/index.js";
import { EStreamEventType } from "../../core/stream-events/types.js";
import { ObjectMatchesTemplate } from "../../lib.js";

import * as SETypes from "./types.js";

export default function TranslateStreamElementsEventToAonyxEvent(
  _event: unknown
): Types.TStreamEvent | undefined {
  if (!ObjectMatchesTemplate(_event, { type: "" })) return undefined;

  function messageFromString(_message: string): Types.TChat {
    return {
      text: _message ?? "",
      emotes: [],
    };
  }

  function translateMessage(seMessage: unknown): Types.TStreamEvent | undefined {
    if (SETypes.isSEMessageEvent(seMessage) === false) return undefined;

    const aonyxMessage: Types.TStreamEvent = {
      tstype: EStreamEventType.TS_TYPE,
      type: EStreamEventType.CHAT,
      username: seMessage.data.nick,
      nickname: seMessage.data.displayName ?? seMessage.data.nick,
      message: {
        text: seMessage.data.text,
        emotes: seMessage.data.emotes.map((seEmote) => ({
          type: seEmote.type,
          name: seEmote.name,
        })),
      },
      permissions: {
        chatter: true,
        follower: false,
        subscriber: seMessage.data.tags.subscriber === "1",
        vip: seMessage.data.tags.vip === "1",
        moderator: seMessage.data.tags.mod === "1",
        streamer: seMessage.data.channel === seMessage.data.nick,
      },
    };
    return aonyxMessage;
  }

  function translateOther(_event: unknown): Types.TStreamEvent | undefined {
    if (SETypes.isSEBasicEvent(_event) === false) return undefined;
    
    //Gift Parsing
    if (_event.type === "subscriber") {
      if (_event.bulkGifted || _event.isCommunityGift || _event.gifted) {
        _event.type = "gift";
      }
    }

    const seEvent: SETypes.SEBasicEvent = _event as SETypes.SEBasicEvent;
    let aonyxEvent: Types.TStreamEvent;
    const base: {
      tstype: EStreamEventType.TS_TYPE;
      username: string;
      permissions: Types.TPermissions;
    } = {
      tstype: EStreamEventType.TS_TYPE,
      username: seEvent.name,
      permissions: {
        chatter: false,
        follower: false,
        subscriber: false,
        vip: false,
        moderator: false,
        streamer: false,
      },
    };
    switch (seEvent.type) {
      case "follower":
        aonyxEvent = {
          ...base,
          type: EStreamEventType.FOLLOW,
        };
        break;
      case "subscriber":
        aonyxEvent = {
          ...base,
          type: EStreamEventType.SUBSCRIBER,
          length: seEvent.amount,
          message: messageFromString(seEvent.message),
        };
        break;
      case "gift":
        if (+seEvent.bulkGifted > 0) {
          //bulk-sent
          aonyxEvent = {
            ...base,
            username: seEvent.sender,
            type: EStreamEventType.GIFT_BULK_SENT,
            count: +seEvent.amount || 1,
          };
        } else if (+seEvent.isCommunityGift > 0) {
          //bulk-received
          aonyxEvent = {
            ...base,
            username: seEvent.sender,
            type: EStreamEventType.GIFT_BULK_RECEIVED,
            receiver: seEvent.name,
          };
        } else {
          //single
          aonyxEvent = {
            ...base,
            username: seEvent.sender,
            type: EStreamEventType.GIFT_SINGLE,
            receiver: seEvent.name,
          };
        }
        break;
      case "raid":
        aonyxEvent = {
          ...base,
          type: EStreamEventType.RAID,
          count: +seEvent.amount || 0,
        };
        break;
      case "cheer":
        aonyxEvent = {
          ...base,
          type: EStreamEventType.CHEER,
          amount: seEvent.amount || 0,
          message: messageFromString(seEvent.message),
        };
        break;
      //case "chat":
      //break;
      default:
        console.error("Unknown event type: ", seEvent.type);
        return undefined;
        break;
    }

    return aonyxEvent;
  }

  if (_event.type !== "message") {
    return translateOther(_event);
  } else {
    return translateMessage(_event);
  }
}