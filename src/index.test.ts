import { GetAonyxBuddyInstanceConfig } from './database/index.js';
import pino from 'pino';
const logger = pino();
import { ConvertInstanceConfigToLegacyConfig } from './database/legacy/convert-legacy.js';
import { IAonyxBuddyInstance } from './database/config-types.js';
import { IClientConfig } from './database/legacy/iclient-config.js';

import { GetTextToSpeech } from './text-to-speech/index.js';
import { GetCoreInstance } from './index.js';
import * as SpriteRendering from './sprite-rendering/index.js';

import * as wsclient from "@aonyxbuddy/websocket-client";

async function main() {
    const config: IAonyxBuddyInstance = (await GetAonyxBuddyInstanceConfig()) as unknown as IAonyxBuddyInstance;
    const legacyConfig: IClientConfig = ConvertInstanceConfigToLegacyConfig(config);

    const aonyxbuddy = await GetCoreInstance(config);

    const renderer = await SpriteRendering.default(config.rendering.spriteRendering)
    if (renderer instanceof Error) throw (renderer);
    Render(renderer);
    if (renderer.sprites['base'].bitmap.length > 0)
        FlipBaseImage(renderer);

    aonyxbuddy.rendererParams.talking.min = 0;
    aonyxbuddy.rendererParams.talking.max = renderer.sprites.talking.bitmap.length;

    function Render(renderer: SpriteRendering.Types.IRenderer) {
        renderer.ClearCanvas();
        renderer.RenderSprite('base', aonyxbuddy.rendererParams?.base.value ?? 0);
        renderer.RenderSprite('mute', aonyxbuddy.rendererParams?.mute.value ?? 0);
        let talkingFrame = Math.floor(aonyxbuddy.rendererParams?.talking.value ?? 0 % (aonyxbuddy.rendererParams?.talking.max ?? 1 - 1));
        talkingFrame = Math.min(talkingFrame, renderer.sprites.talking.bitmap.length-1);
        renderer.RenderSprite('talking', talkingFrame, () => { Render(renderer); });
    }

    function FlipBaseImage(renderer: SpriteRendering.Types.IRenderer) {
        if (typeof aonyxbuddy.rendererParams.base !== "undefined") {
            aonyxbuddy.rendererParams.base.max = renderer.sprites["base"].bitmap.length;
            aonyxbuddy.rendererParams.base.value += 1;
            aonyxbuddy.rendererParams.base.value %= aonyxbuddy.rendererParams.base.max;
            aonyxbuddy.rendererParams.base.value = Math.floor(aonyxbuddy.rendererParams.base.value);
            setTimeout(() => {
                FlipBaseImage(renderer);
            }, renderer.sprites['base'].delay[Math.floor(aonyxbuddy.rendererParams.base.value)]);
        }
    }

    wsclient.GetWebSocketClient({
        url: "wss://www.aonyxlimited.com/api/v1/ws",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHJlYW0iOiJ3YXRlcmthdHR2IiwicmVhZCI6dHJ1ZSwid3JpdGUiOmZhbHNlfQ.guLyZ35l1Hal-_1q8DvMkYxfacOK_W8UDTbOmdXhH5U",
        logging: 'none',
        callback: (event: any) => {
            window.dispatchEvent(
                new CustomEvent(
                    event.tstype ?? "aonyxbuddy-event",
                    { detail: event }
                )
            );
        }
    });
};

main();