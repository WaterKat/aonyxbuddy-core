export interface ISpriteRendererConfig {
    canvas: ICanvasConfig,
    defaultFPS: number,
    sprites: SpriteReferences
}

export interface ICanvasConfig {
    size: {
        x: number,
        y: number
    },
    antialiasing: boolean
}

export interface SpriteReferences {
    [key: string] : string | string[]
}

export interface ISpriteData {
    delay: number[],
    bitmap: ImageBitmap[]
}

export interface IAnimationData {
    [key: string] : ISpriteData
}
