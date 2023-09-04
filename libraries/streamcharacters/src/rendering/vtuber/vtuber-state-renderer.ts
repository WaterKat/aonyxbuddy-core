import { AnimationStateManager, IAsyncInitializable } from '../../external.js';

import * as FrankTTS from '../../config/index.js';
import { IRenderer, IRendererInputs } from '../irenderer.js';

interface IVtuberConfig extends FrankTTS.ConfigComponents.VTube { }

export interface IVTuberRendererOptions {
    config: IVtuberConfig
}

export class VTuberRenderer implements IAsyncInitializable, IRenderer {
    options: IVTuberRendererOptions;

    config!: IVtuberConfig;
    externalData!: IRendererInputs;

    stateMachine: AnimationStateManager = new AnimationStateManager;


    constructor(options: IVTuberRendererOptions) {
        this.options = options;
    }

    async Initialize() {
        const { config } = this.options;

        this.config = config;
        this.externalData = { tts: { is_playing: () => { return false }, amplitude: () => { return 0 }, } };
    }

    GetState() {
        return this.stateMachine.GetState();
    }

    Link(inputs : IRendererInputs) {
        this.externalData = inputs;
    }

    async RequestAndAwaitState(_targetID: string): Promise<void> {
        _targetID; //temp
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
    }
}