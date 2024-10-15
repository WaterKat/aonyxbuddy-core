import { ObjectMatchesTemplate } from "../../lib.js";

// #region Raw Event
export type SERawEvent = {
  detail: { 
    listener: string,
    event: { 
      itemId: string | undefined,
    } 
  }
}

export const SERawEventTemplate: SERawEvent = {
  detail: {
    listener: "string",
    event: {
      itemId: undefined,
    },
  },
} as const;
// #endregion

// #region Basic Event
export interface SEBasicEvent {
  type: string;
  name: string;
  amount: number;
  message: string;
  gifted: boolean;
  sender: string;
  bulkGifted: boolean;
  isCommunityGift: boolean;
  playedAsCommunityGift: boolean;
}

export const SEBasicEventTemplate: SEBasicEvent = {
  type: "string",
  name: "string",
  amount: 0,
  message: "string",
  gifted: false,
  sender: "string",
  bulkGifted: false,
  isCommunityGift: false,
  playedAsCommunityGift: false,
} as const;

export function isSEBasicEvent(event: unknown): event is SEBasicEvent {
  if (!ObjectMatchesTemplate(event, SEBasicEventTemplate)) return false;
  return true;
}

// #endregion

// #region Message Event
export interface SEMessageEvent {
  data: {
    nick: string;
    displayName?: string;
    time: number;
    userId: string;
    displayColor: string;
    channel: string;
    text: string;
    msgId: string;
    tags: SETag;
    emotes: SEEmote[];
  };
}

export interface SEEmote {
  type: string;
  name: string;
}

export interface SETag {
  mod: string;
  subscriber: string;
  vip: string;
}

const SEMessageEventTemplate: SEMessageEvent = {
  data: {
    nick: "string",
    displayName: undefined,
    time: 0,
    userId: "string",
    displayColor: "string",
    channel: "string",
    text: "string",
    msgId: "string",
    tags: {
      mod: "string",
      subscriber: "string",
      vip: "string",
    },
    emotes: [
      {
        type: "string",
        name: "string",
      },
    ],
  },
} as const;

export function isSEMessageEvent(event: unknown): event is SEMessageEvent {
  if (!ObjectMatchesTemplate(event, SEMessageEventTemplate)) return false;
  return true;
}

// #endregion
