
export interface ITextToSpeech {
    Speak : (text : string) => Promise<void>;
    Interrupt : () => void;
    GetAmplitude : () => number;
    IsPlaying : () => boolean;
}
