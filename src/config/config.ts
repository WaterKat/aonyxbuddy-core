import { IClientConfig } from './iclient-config.js';
import defaultConfig from './default-config.js';

declare const providedConfig : IClientConfig;

function GetConfig() {
    if (typeof providedConfig !== 'undefined'){
        return providedConfig;
    }
    return defaultConfig
}

const config : IClientConfig = GetConfig();

export default config;
