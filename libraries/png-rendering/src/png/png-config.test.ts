import * as PNGConfig from './ipng-config.js';

export const PNGConfigExample: PNGConfig.IPNGConfig = {
    size: {
        x: 256,
        y: 256
    },
    smoothed : true,
    defaultFPS: 10,
    transitions: {
        idle: [['talking*', undefined, 0]],
        talking: [['idle*', undefined, 0]]
    },
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
