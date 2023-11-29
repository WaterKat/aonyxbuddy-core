export { };

/** an options interface for use with TextToSpeech */
export interface ITextToSpeechOptions {
    voice: StreamElementsVoiceID
}

/** A string type that is a tested valid voice id for use with stream elements text to speech */
export type StreamElementsVoiceID =
    'Salli' |
    'Matthew' |
    'Kimberly' |
    'Kendra' |
    'Justin' |
    'Joey' |
    'Joanna' |
    'Ivy' |
    'Emma' |
    'Brian' |
    'Amy';

/** The object interface of a TextToSpeech service within aonyxbuddy, similar to a class */
export interface ITextToSpeechWrapper {
    context: AudioContext;
    analyzer: AnalyserNode;
    Speak: (text: string, onStop?: () => void) => Promise<AudioBufferSourceNode | undefined>;
    Stop: () => void;
}