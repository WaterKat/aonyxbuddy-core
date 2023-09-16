
export type Frank = {
    rendering: Rendering;
    audio: Audio;
};

export type Rendering = {
    type?: string;
    png?: PNG;
    vtube?: VTube;
} & ({
    type: 'png';
    png: PNG;
} | {
    type: 'vtubestudio';
    vtube: VTube;
});

export type PNG = {
    size: Vector2;
    defaultFPS: number;
    transitions: { [key: string]: [string, string?, number?]; };
    sprites: Sprites;
};

export type Vector2 = {
    x: number;
    y: number;
};

export type Sprites = {
    idle: string | string[];
    [key: string]: string | string[];
};

export type VTube = object;

export type Audio = {
    tts: TTS;
    sfx: SFX;
};

export type TTS = object & ({
    type: 'stream-elements';
    voice: (
        'Salli' |
        'Matthew' |
        'Kimberly' |
        'Kendra' |
        'Justin' |
        'Joey' |
        'Joanna' |
        'Ivy' |
        'Emma' |
        'Brian' |
        'Amy');
});

export type SFX = object;

export type Admin = {
    permissions: Permissions;
    filters: Filter;
};

export type Permissions = {
    voice: Tags;
    text: Tags;
    command: Tags;
};

export type Tags = {
    bot: 'none' | 'bot';
    chatter: 'none' | 'chatter';
    follower: 'none' | 'follower';
    subscriber: 'none' | 'prime' | 'tier1' | 'tier2' | 'tier3';
    vip: 'none' | 'vip';
    moderator: 'none' | 'moderator' | 'editor';
    streamer: 'none' | 'streamer';
};

export type Chat = {
    tags: Record<string, Tags>;
    nicknames: Record<string, string[]>;
};

export type Filter = {
    emotes: Array<'emoji' | 'ffz' | 'bttv' | '7tv' | 'twitch'>;
    words: string[];
};

export type ResponsesPerEvent = {
    follow: Responses;
    subscriber: Responses;
    gift: Responses;
    bulk: Responses;
    raid: Responses;
    cheer: Responses;
    chat: Responses;
    command: Responses;
    redeem: Responses;
};

export type Responses = {
    bot: string[];
    chatter: string[];
    follower: string[];
    subscriber: {
        prime: string[];
        tier1: string[];
        tier2: string[];
        tier3: string[];
    };
    vip: string[];
    moderator: {
        moderator: string[];
        editor: string[];
    };
    streamer: string[];
};

