export type IPNGConfig = {
    size: Vector2;
    smoothed: boolean;
    defaultFPS: number;
    transitions: {
        [key : string] : Array<[string, string?, number?]>;
    }
    sprites: Sprites;
}

export type Vector2 = {
    x: number,
    y: number
}

export type Sprites = {
    idle : string | string[],
    talking : string | string[],
    [key: string] : string | string[]
}
