export type RendererGenericStates = '*idle' | '*talking';

export interface IRenderer {
    RequestAndAwaitState : (state : RendererGenericStates | string) => Promise<void>;
    Link : (inputs : IRendererInputs) => void;
    GetState : () => string;
}

export interface IRendererInputs {
    tts : {
        amplitude : () => number;
        is_playing : () => boolean;
    };
}
