import { Types } from '../index.js';

const config: Types.ISpriteRendererConfig = {
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
            'https://resources.aonyxlimited.com/DebugImages/idle/0.png',
            'https://resources.aonyxlimited.com/DebugImages/idle/1.png',
            'https://resources.aonyxlimited.com/DebugImages/idle/2.png',
            'https://resources.aonyxlimited.com/DebugImages/idle/3.png',
            'https://resources.aonyxlimited.com/DebugImages/idle/4.png'
        ],
        talking: [
            'https://resources.aonyxlimited.com/DebugImages/talking/0.png',
            'https://resources.aonyxlimited.com/DebugImages/talking/1.png',
            'https://resources.aonyxlimited.com/DebugImages/talking/2.png',
            'https://resources.aonyxlimited.com/DebugImages/talking/3.png',
            'https://resources.aonyxlimited.com/DebugImages/talking/4.png'
        ]
    }
}

export default config