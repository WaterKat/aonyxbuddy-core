import { expect, test } from 'bun:test';
import { ClientConfigExample } from './config/iclient-config-cupidjpeg.test.js';
import { ConvertInstanceConfigToLegacyConfig, ConvertLegacyConfigToInstanceConfig } from './convert-legacy';

const converted = ConvertLegacyConfigToInstanceConfig(ClientConfigExample);

console.log(JSON.stringify(converted));

const convertedBack = ConvertInstanceConfigToLegacyConfig(converted);

//console.log(convertedBack);

test.skip("conversion test", () => {
    expect(convertedBack).toBe(ClientConfigExample);
})


