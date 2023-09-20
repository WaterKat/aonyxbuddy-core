import * as index from './index.js';
import config from './config/default.config.js';
async function main() {
    const renderer = await index.default(config)
    if (renderer instanceof Error) throw (renderer);

    let frame = 0;

    function anim(): void {
        if (renderer instanceof Error) return;
        frame++;
        if (frame >= renderer.sprites['idle'].bitmap.length) {
            frame = 0;
        }
        renderer.renderSprite('idle', frame, anim);
    }

    anim();
}

main();