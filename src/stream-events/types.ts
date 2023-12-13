export enum StreamEventType {
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
    OTHER = 'other'

}

export type Permissions = {
    chatter: boolean,
    follower: boolean,
    subscriber: boolean,
    vip: boolean,
    moderator: boolean,
    streamer: boolean,
}

export type Emote = {
    type: string,
    name: string
}

export type ChatMessage = {
    text: string,
    emotes: Array<Emote>
}

export type StreamEvent = {
    tstype: StreamEventType.TS_TYPE,
    type : Exclude<StreamEventType, StreamEventType.TS_TYPE>,
    username: string,
    nickname?: string,
    permissions?: Permissions,
    message? : ChatMessage,

    subscriber_length? : number,
    gift_receiver? : string,
    gift_count?: number,
    raid_count? : number,
    cheer_amount? : number,
    command_identifier? : string,
    command_group? : string,
    command_request? : string,
    command_args? : string,
    redeem_id? : string,
    ignore_message? : string,
    custom_id? : string,
    custom_args? : string[],
} & ({
    type: StreamEventType.FOLLOW
} | {
    type: StreamEventType.SUBSCRIBER
    message: ChatMessage,
    subscriber_length : number,
} | {
    type: StreamEventType.GIFT_SINGLE
    gift_receiver : string,
} | {
    type: StreamEventType.GIFT_BULK_SENT
    gift_count: number,
} | {
    type: StreamEventType.GIFT_BULK_RECEIVED
    gift_receiver : string,
} | {
    type: StreamEventType.RAID
    raid_count : number,
} | {
    type: StreamEventType.CHEER
    message : ChatMessage,
    cheer_amount : number,
} | {
    type: StreamEventType.CHAT
    message : ChatMessage,
} | {
    type: StreamEventType.COMMAND,
    message : ChatMessage,
    command_identifier : string,
    command_group : string,
    command_request : string,
    command_args : string,
} | {
    type: StreamEventType.REDEEM
    message: ChatMessage,
    redeem_id : string,
} | {
    type: StreamEventType.OTHER
    original : StreamEvent,
    other : {
        [key: string] : string
    }
})