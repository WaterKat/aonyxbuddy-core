/**
 * This enum represents the different types of stream events that can be emitted
 */
export enum EStreamEventType {
    FOLLOW = 'follow',
    SUBSCRIBER = 'subscriber',
    GIFT_SINGLE = 'gift-single',
    GIFT_BULK_SENT = 'gift-bulk-sent',
    GIFT_BULK_RECEIVED = 'gift-bulk-received',
    RAID = 'raid',
    CHEER = 'cheer',
    CHAT = 'chat',
    CHAT_FIRST = 'chat-first',
    COMMAND = 'command',
    REDEEM = 'redeem',
    IGNORE = 'ignore',
    OTHER = 'other'
}

/**
 * This type represents a single emote within a message
 */
export type TEmote = {
    type: string,
    name: string
}

/**
 * This type represents a chat message, and any emotes within it
 */
export type TChatMessage = {
    text: string,
    emotes: TEmote[]
}

export type TBaseStreamEvent = {
    type: EStreamEventType,
    username: string,
    nickname?: string,
}

export type TMessageStreamEvent = {
    message: TChatMessage
}

export type TStreamEvent =
    | TBaseStreamEvent & {
        type: EStreamEventType.IGNORE,
        reason: string
    }
    | TBaseStreamEvent & {
        type: EStreamEventType.FOLLOW
    }
    | TBaseStreamEvent & {
        type: EStreamEventType.GIFT_SINGLE,
        receiver: string
    }
    | TBaseStreamEvent & {
        type: EStreamEventType.GIFT_BULK_SENT,
        count: number
    }
    | TBaseStreamEvent & {
        type: EStreamEventType.GIFT_BULK_RECEIVED,
        receiver: string
    }
    | TBaseStreamEvent & {
        type: EStreamEventType.RAID,
        count: number
    }
    | TBaseStreamEvent & {
        type: EStreamEventType.COMMAND,
        identifier: string,
        action: string,
        args: string
    }
    | TBaseStreamEvent & TMessageStreamEvent & {
        type: EStreamEventType.SUBSCRIBER
        length: number
    }
    | TBaseStreamEvent & TMessageStreamEvent & {
        type: EStreamEventType.CHEER
        amount: number
    }
    | TBaseStreamEvent & TMessageStreamEvent & {
        type: EStreamEventType.REDEEM
        id: number
    }
    | TBaseStreamEvent & TMessageStreamEvent & {
        type: EStreamEventType.CHAT | EStreamEventType.CHAT_FIRST
    }
    | TBaseStreamEvent & {
        type: EStreamEventType.OTHER,
        other: any
    }

export const IsTMessageStreamEvent = (
    event: TStreamEvent
): boolean => (
    event.type in 
    [
        EStreamEventType.CHAT, 
        EStreamEventType.CHAT_FIRST, 
        EStreamEventType.CHEER, 
        EStreamEventType.REDEEM, 
        EStreamEventType.SUBSCRIBER
    ]
)
