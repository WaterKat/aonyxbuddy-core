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