import { IAsyncInitializable } from '../external.js';
import { IRenderer, IRendererInputs, RendererGenericStates } from '../rendering/irenderer.js';
import { ITextToSpeech } from '../text-to-speech/itext-to-speech.js';

export interface IStreamCharacterOptions {
    renderer: IRenderer;
    tts: ITextToSpeech;
}

export class StreamCharacter implements IAsyncInitializable {
    options: IStreamCharacterOptions;
    private enabled: boolean = false;
    constructor(options: IStreamCharacterOptions) {
        this.options = options;
    }
    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    renderer!: IRenderer
    tts!: ITextToSpeech

    async Initialize() {
        if (this.enabled) return;

        this.renderer = this.options.renderer;
        this.tts = this.options.tts;

        const rendererInputs: IRendererInputs = {
            tts: {
                amplitude: () => { return this.tts.GetAmplitude(); },
                is_playing: () => { return this.tts.IsPlaying(); }
            }
        }

        this.renderer.Link(rendererInputs);

        this.enabled = true;
    }

    async Speak(text: string): Promise<void> {
        if (!this.enabled) return;
        const originalState: string = this.renderer.GetState();
        const talkingState: RendererGenericStates = '*talking';

        await this.renderer.RequestAndAwaitState(talkingState);
        await this.tts.Speak(text);
        await this.renderer.RequestAndAwaitState(originalState);
    }

    Interrupt(): void {
        this.tts.Interrupt();
    }
}
