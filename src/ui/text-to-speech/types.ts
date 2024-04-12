export { };

/** an options interface for use with TextToSpeech */
export interface ITextToSpeechOptions {
    voice: StreamElementsVoiceID,
    context?: AudioContext
}

/** 
 * A string type that is a tested valid voice id for use with stream elements
 *  text to speech 
 */
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

