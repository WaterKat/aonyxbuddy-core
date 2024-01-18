import { GetAonyxBuddyInstanceConfig } from './database/index.js';
import pino from 'pino';
const logger = pino();
import { ConvertInstanceConfigToLegacyConfig } from './database/legacy/convert-legacy.js';
import { IAonyxBuddyInstance } from './database/config-types.js';
import { IClientConfig } from './database/legacy/iclient-config.js';

import GetTextToSpeech from './text-to-speech/index.js';

async function main() {
    const newConfig : IAonyxBuddyInstance = (await GetAonyxBuddyInstanceConfig()) as unknown as IAonyxBuddyInstance;
    const legacyConfig : IClientConfig= ConvertInstanceConfigToLegacyConfig(newConfig);
    
    const tts = GetTextToSpeech(legacyConfig.tts);
    tts.Speak("this is a hello from aonyxbuddy");
}; 

main();