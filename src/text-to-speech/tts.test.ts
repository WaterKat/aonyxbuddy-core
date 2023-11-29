import { GetTextToSpeech } from './tts.js';
import config from './config/default.config.js';

const tts = GetTextToSpeech(config,)

function speak() {
    tts.Speak('This is a test ' + new Date().toDateString(), () => {
        setTimeout(speak, 1000 * 5);
    });
}

speak();