export type IPNGConfig = {
    size: Vector2;
    smoothed: boolean;
    defaultFPS: number;
    transitions: {
        [key : string] : Array<[string, string?, number?]>;
    }
    sprites: SpriteReferences;
}

export type Vector2 = {
    x: number,
    y: number
}

export interface SpriteReferences {
    idle : string | string[],
    talking : string | string[],
    [key: string] : string | string[]
}

export interface ISpriteData {
    delay: number[],
    bitmap: ImageBitmap[]
}

export interface IAnimationData {
    idle : ISpriteData,
    talking : ISpriteData,
    [key: string] : ISpriteData
}
