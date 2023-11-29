export type StreamEventTypeID = 'follow' | 'subscriber' | 'gift-single' | 'gift-bulk-sent' | 'gift-bulk-received' | 'raid' | 'cheer' | 'chat' | 'command' | 'redeem';
export type Permissions = {
    chatter: boolean;
    follower: boolean;
    subscriber: boolean;
    vip: boolean;
    moderator: boolean;
    streamer: boolean;
};
export type Emote = {
    type: string;
    name: string;
};
export type ChatMessage = {
    text: string;
    emotes: Array<Emote>;
};
export type StreamEvent = {
    type: string;
    username: string;
    nickname?: string;
    permissions?: Permissions;
    message?: ChatMessage;
    subscriber_length?: number;
    gift_receiver?: string;
    gift_count?: number;
    raid_count?: number;
    cheer_amount?: number;
    command_identifier?: string;
    command_group?: string;
    command_request?: string;
    command_args?: string;
    redeem_id?: string;
    ignore_message?: string;
    custom_id?: string;
    custom_args?: string[];
} & ({
    type: 'follow';
} | {
    type: 'subscriber';
    message: ChatMessage;
    subscriber_length: number;
} | {
    type: 'gift-single';
    gift_receiver: string;
} | {
    type: 'gift-bulk-sent';
    gift_count: number;
} | {
    type: 'gift-bulk-received';
    gift_receiver: string;
} | {
    type: 'raid';
    raid_count: number;
} | {
    type: 'cheer';
    message: ChatMessage;
    cheer_amount: number;
} | {
    type: 'chat';
    message: ChatMessage;
} | {
    type: 'command';
    message: ChatMessage;
    command_identifier: string;
    command_group: string;
    command_request: string;
    command_args: string;
} | {
    type: 'redeem';
    message: ChatMessage;
    redeem_id: string;
} | {
    type: 'other';
    original: StreamEvent;
    other: {
        [key: string]: string;
    };
});
