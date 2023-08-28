export type StreamEventTypeID = 
'follow' | 'subscriber' | 
'gift-single' | 'gift-bulk-sent' | 'gift-bulk-received' | 
'raid' | 'cheer' | 'chat' | 'command' | 'redeem';


export type StreamEvent = {
    type : string; 
    username: string;
    nickname?: string;
    permissions?: StreamEventComponent.Permissions;
    message? : StreamEventComponent.Message;

    subscriber_length? : number;
    gift_receiver? : string;
    gift_count?: number;
    raid_count? : number;
    cheer_amount? : number;
    command_identifier? : string;
    command_group? : string;
    command_request? : string;
    command_args? : string;
    redeem_id? : string;
    ignore_message? : string;
    custom_id? : string;
    custom_args? : string[];
} & ({
    type: 'follow';
} | {
    type: 'subscriber';
    message: StreamEventComponent.Message;
    subscriber_length : number;
} | {
    type: 'gift-single';
    gift_receiver : string;
} | {
    type: 'gift-bulk-sent';
    gift_count: number;
} | {
    type: 'gift-bulk-received';
    gift_receiver : string;
} | {
    type: 'raid';
    raid_count : number;
} | {
    type: 'cheer';
    message : StreamEventComponent.Message;
    cheer_amount : number;
} | {
    type: 'chat';
    message : StreamEventComponent.Message;
} | {
    type: 'command';
    message : StreamEventComponent.Message;
    command_identifier : string;
    command_group : string;
    command_request : string;
    command_args : string;
} | {
    type: 'redeem';
    message: StreamEventComponent.Message;
    redeem_id : string;
} | {
    type : 'ignore';
    ignore_message : string;
} | {
    type : 'custom';
    custom_id : string;
    custom_args : string[];
})


export namespace StreamEventComponent {
    export type Permissions = {
        chatter: boolean,
        follower: boolean,
        subscriber: boolean,
        vip: boolean,
        moderator: boolean,
        streamer: boolean,
    };

    export type Emote = {
        type: string,
        name: string
    }

    export type Message = {
        text: string;
        emotes: Array<Emote>
    }
}
