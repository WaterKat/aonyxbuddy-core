import * as index from './index.js';
import config from './config/offline.config.js';



async function main() {
    document.body.style.background = 'DarkSeaGreen';

    const renderer = await index.default(config)
    if (renderer instanceof Error) throw (renderer);

    const state = {
        base: 0,
        idle: 0,
        talking: 0,
        varA: 0,
        varB: 0
    }

    function anim(): void {
        if (renderer instanceof Error) return;

        //idle
        state.idle++;
        if (state.idle >= renderer.sprites['idle'].bitmap.length) {
            state.idle = 0;
        }

        //talking
        const sinVal = (Math.sin(new Date().getTime() / 1000) + 1) / 2;
        state.talking = Math.round((renderer.sprites['talking'].bitmap.length - 1) * sinVal);

        //talking
        const sinValA = (Math.sin((2 / 3) * new Date().getTime() / 1000) + 1) / 2;
        state.varA = Math.round((renderer.sprites['varA'].bitmap.length - 1) * sinValA);

        //talking
        const sinValB = (Math.sin((4 / 7) * new Date().getTime() / 1000) + 1) / 2;
        state.varB = Math.round((renderer.sprites['varB'].bitmap.length - 1) * sinValB);

        renderer.ClearCanvas();
        renderer.RenderSprite('base', 0);
        renderer.RenderSprite('idle', state.idle);
        renderer.RenderSprite('talking', state.talking);
        renderer.RenderSprite('varA', state.varA);
        renderer.RenderSprite('varB', state.varB, anim);
    }

    anim();
}

window.onload = main;