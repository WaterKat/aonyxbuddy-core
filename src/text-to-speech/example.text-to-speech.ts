import { GetTextToSpeech } from './tts.js';
import config from './example.config.js';

/** first you get your tts wrapper, and hold the reference */
const tts = GetTextToSpeech(config);

/** this is an example function on how to request speech from th wrapper */
function speak() {

    
    //** the actual speaking function */
    tts.Speak(
        /** the text to be spoken, in this case "this is a test November 28th etc etc" */
        'This is a test ' + new Date().toDateString(),
        /** once the speech has finished, run this code
         * This function will call 'speak' again after 1000 * 5 milliseconds (5 seconds)
         */
        () => {
            setTimeout(speak, 1000 * 5);
        }
    );


}

speak();
