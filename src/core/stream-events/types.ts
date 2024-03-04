/**
 * This enum represents the different types of stream events that can be emitted
 */
export enum EStreamEventType {
    TS_TYPE = 'al-aonyxbuddy-data',
    FOLLOW = 'follow',
    SUBSCRIBER = 'subscriber',
    GIFT_SINGLE = 'gift-single',
    GIFT_BULK_SENT = 'gift-bulk-sent',
    GIFT_BULK_RECEIVED = 'gift-bulk-received',
    RAID = 'raid',
    CHEER = 'cheer',
    CHAT = 'chat',
    COMMAND = 'command',
    REDEEM = 'redeem',
    IGNORE = 'ignore',
    OTHER = 'other',
    CHAT_FIRST = 'chat-first'
}

/**
 * This type represents the different permission types a user can have
 */
export type TPermissions = {
    chatter: boolean,
    follower: boolean,
    subscriber: boolean,
    vip: boolean,
    moderator: boolean,
    streamer: boolean,
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

/**
 * This type represents a stream event emmitted by an ongoing stream
 */
export type TStreamEvent = {
    tstype: EStreamEventType.TS_TYPE,
    type : Exclude<EStreamEventType, EStreamEventType.TS_TYPE>,
    username: string,
    nickname?: string,
    permissions?: TPermissions,
} & ({
    type: EStreamEventType.FOLLOW
} | {
    type: EStreamEventType.SUBSCRIBER
    message: TChatMessage,
    subscriber_length : number,
} | {
    type: EStreamEventType.GIFT_SINGLE
    gift_receiver : string,
} | {
    type: EStreamEventType.GIFT_BULK_SENT
    gift_count: number,
} | {
    type: EStreamEventType.GIFT_BULK_RECEIVED
    gift_receiver : string,
} | {
    type: EStreamEventType.RAID
    raid_count : number,
} | {
    type: EStreamEventType.CHEER
    message : TChatMessage,
    cheer_amount : number,
} | {
    type: EStreamEventType.CHAT
    message : TChatMessage,
} | {
    type: EStreamEventType.CHAT_FIRST
    message : TChatMessage,
} | {
    type: EStreamEventType.COMMAND,
    //message : ChatMessage,
    command_identifier : string,
    command_group? : string,
    command_action : string,
    command_args : string,
} | {
    type: EStreamEventType.REDEEM
    message: TChatMessage,
    redeem_id : string,
} | {
    type: EStreamEventType.OTHER
    original : TStreamEvent,
    other : {
        [key: string] : string
    }
} | {
    type: EStreamEventType.IGNORE,
    reason: string
})