import { SpriteRenderingConfig } from "./entry";
import {
  IRendererData,
  IRendererParam,
  //IRenderConfiguration
} from "./renderer";

/**
 * The legacy configuration type, containing the canvas size, antialiasing
 * setting, default frames per second, and the sprites configuration.
 */
export interface ILegacyConfig {
  canvas: {
    size: {
      x: number;
      y: number;
    };
    antialiasing: boolean;
  };
  defaultFPS: number;
  sprites: {
    [key: string]: string | string[];
  };
}

/**
 * Checks if the value is a legacy configuration object.
 * @param value the value to check if it is a object
 */
export function IsLegacyConfig(
  value: unknown
): value is ILegacyConfig {
  if (typeof value !== "object") return false;
  if (typeof (value as ILegacyConfig).canvas !== "object") return false;
  if (typeof (value as ILegacyConfig).defaultFPS !== "number") return false;
  if (typeof (value as ILegacyConfig).sprites !== "object") return false;
  return true;
}

/**
 * Converts a legacy configuration to the new configuration type.
 * @param legacyConfig the legacy configuration to convert
 * @returns the new configuration type
 */
export function ConvertLegacyConfiguration(
  legacyConfig: ILegacyConfig
): SpriteRenderingConfig {
  const renderData = ConvertLegacySpritesToRenderData(
    legacyConfig.sprites,
    legacyConfig.defaultFPS
  );

  return {
    canvas: legacyConfig.canvas,
    renderDatas: renderData,
    params: renderData.map(
      (data) =>
        <IRendererParam>{
          name: data.name,
          value: data.paramInfo.default,
        }
    ),
  };
}

/**
 * convert legacy sprites to render data configuration type.
 * @param sprites the legacy sprites configuration, containing sprite names and
 * urls of the sprite images.
 * @returns the render data configuration, containing sprite names, parameter
 * defaults, and the image bitmaps.
 */
export function ConvertLegacySpritesToRenderData(
  sprites: { [key: string]: string | string[] },
  defaultFPS: number
): IRendererData[] {
  const defaultDelay = 1000 / defaultFPS;
  return Object.keys(sprites).map(
    (key) =>
      <IRendererData>{
        name: key,
        paramInfo: {
          min: 0,
          max: 1,
          default: 0,
        },
        delay: defaultDelay,
        urls:
          typeof sprites[key] === "string"
            ? [sprites[key]]
            : (sprites[key] as string[]).map((url) => url),
        bitmaps: [],
      }
  );
}
