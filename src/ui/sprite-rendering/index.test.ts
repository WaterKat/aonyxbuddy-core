import { CreateCanvas } from "./canvas.js";
import { IRendererData, IRenderParams, RenderParams } from "./renderer.js";

const config = {
    canvas: {
        size: {
            x: 256,
            y: 256
        },
        antialiasing: false
    },
    defaultFPS: 10,
    sprites: {
        idle: [
            "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/base.png"
        ],
        talking: [
            "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/0.png",
            "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/1.png",
            "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/2.png",
            "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/3.png",
            "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/4.png",
            "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/5.png",
            "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/6.png",
            "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/7.png",
            "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/8.png",
            "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/9.png",
            "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/10.png"
        ]
    },
    renderData: [
        {
            name: "idle",
            paramInfo: {
                min: 0,
                max: 1,
                default: 0
            },
            urls: [
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/base.png"
            ]
        },
        {
            name: "talking",
            paramInfo: {
                min: 0,
                max: 1,
                default: 0
            },
            urls: [
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/0.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/1.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/2.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/3.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/4.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/5.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/6.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/7.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/8.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/9.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/10.png"
            ]
        }
    ],
};

const ConvertLegacySpritesToRenderData = (
    sprites: { [key: string]: string[] }
) => Object.keys(sprites).map(key => ({
    name: key,
    paramInfo: {
        min: 0,
        max: 1,
        default: 0
    },
    urls: sprites[key].map(url => url)
}));

let canvas: HTMLCanvasElement;
try { canvas = CreateCanvas(config.canvas); }
catch (e) { canvas = { getContext: (s: string) => ({}) } as HTMLCanvasElement; }

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const renderOptions = {
    ctx: ctx,
    renderDatas: [
        {
            name: "idle",
            paramInfo: {
                min: 0,
                max: 1,
                default: 0
            },
            urls: [
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/base.png"
            ]
        },
        {
            name: "talking",
            paramInfo: {
                min: 0,
                max: 1,
                default: 0
            },
            urls: [
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/0.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/1.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/2.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/3.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/4.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/5.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/6.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/7.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/8.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/9.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/10.png"
            ]
        }
    ],
};

console.log("config", config);

const convertedLegacy = {
    canvas: config.canvas,
    defaultFPS: config.defaultFPS,
    renderOptions: ConvertLegacySpritesToRenderData(config.sprites)
}

console.log("convertedLegacy", convertedLegacy);