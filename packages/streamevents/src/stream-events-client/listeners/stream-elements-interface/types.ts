export interface SEBasicEvent {
    type: string
    name: string
    amount: number
    message: string
    gifted: boolean
    sender: string
    bulkGifted: boolean
    isCommunityGift: boolean
    playedAsCommunityGift: boolean
}

export interface SEMessageEvent {
    data: {
        time: number
        tags: SETag
        nick: string
        userId: string
        displayName: string
        displayColor: string
        channel: string
        text: string
        emotes: SEEmote[]
        msgId: string
    }
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
