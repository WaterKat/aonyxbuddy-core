
/**
 * The legacy configuration type, containing the canvas size, antialiasing
 * setting, default frames per second, and the sprites configuration.
 */
export interface ILegacyConfig {
    canvas: {
        size: {
            x: number,
            y: number
        },
        antialiasing: boolean
    },
    defaultFPS: number,
    sprites: {
        [key: string]: string | string[]
    }
}

/**
 * convert legacy sprites to render data configuration type. 
 * @param sprites the legacy sprites configuration, containing sprite names and
 * urls of the sprite images.
 * @returns the render data configuration, containing sprite names, parameter
 * defaults, and the image bitmaps.
 */
export const ConvertLegacySpritesToRenderData = (
    sprites: { [key: string]: string | string[] }
) => Object.keys(sprites).map(key => ({
    name: key,
    paramInfo: {
        min: 0,
        max: 1,
        default: 0
    },
    urls: typeof sprites[key] === "string" ? [sprites[key]]
        : sprites[key].map(url => url),
    bitmaps: []
}));

/**
 * Converts a legacy configuration to the new configuration type.
 * @param legacyConfig the legacy configuration to convert
 * @returns the new configuration type
 */
export const ConvertIfLegacyConfiguration = (legacyConfig: ILegacyConfig) => ({
    canvas: legacyConfig.canvas,
    defaultFPS: legacyConfig.defaultFPS,
    renderData: ConvertLegacySpritesToRenderData(legacyConfig.sprites)
});

