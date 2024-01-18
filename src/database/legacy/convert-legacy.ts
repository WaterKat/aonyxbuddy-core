import { IClientConfig } from "./iclient-config.js";
import { IAonyxBuddyInstance } from "../config-types.js";

export function ConvertInstanceConfigToLegacyConfig(config: IAonyxBuddyInstance): IClientConfig {
    const convertedResponses: Record<string, string[]> = {}

    for (let responseKey in config.responses) {
        const keys = config.responses[responseKey];
        keys.forEach(key => {
            if (key === "voice" || key === "chat") return;
            if (typeof convertedResponses[key] === "undefined") {
                convertedResponses[key] = [];
            }
            convertedResponses[key].push(responseKey);
        });
    }

    const legacyConfig: IClientConfig = {
        owner_id: config.owner?.username ?? "",
        nickname: config.instance_nickname,
        nicknames: config.users.nicknames,
        spriteRendering: config.rendering.spriteRendering,
        tts: config.texttospeech,
        blockedWords: config.security.blockedWords,
        blacklist: config.security.blacklist,
        botlist: config.users.botlist,
        responses: {
            voice: convertedResponses
        }
    }
    return legacyConfig;
}

export function ConvertLegacyConfigToInstanceConfig(config: IClientConfig): IAonyxBuddyInstance {
    const convertedResponses: Record<string, string[]> = {}

    for (let responseTag in config.responses) {
        const responseGroups = config.responses[responseTag];
        for (let responseType in responseGroups) {
            const responses = responseGroups[responseType];
            responses.forEach(response => {
                if (typeof convertedResponses[response] === "undefined") {
                    convertedResponses[response] = [];
                }
                if (!convertedResponses[response].includes(responseTag) && responseTag !== "voice")
                    convertedResponses[response].push(responseTag);
                if (!convertedResponses[response].includes(responseType) && responseType !== "voice")
                    convertedResponses[response].push(responseType);
            });
        }
    }

    const newConfig: IAonyxBuddyInstance = {
        owner: {
            username: config.owner_id
        },
        instance_nickname: config.nickname,
        rendering: {
            spriteRendering: config.spriteRendering
        },
        texttospeech: config.tts,
        users: {
            nicknames: config.nicknames,
            botlist: config.botlist
        },
        commands: {
            prefixes: [
                "!aonyxbuddy",
                `${config.commandIdentifier ?? '!'}${config.commandGroup ?? config.nickname}`
            ],
            actions: [
                "say",
                "mute",
                "unmute",
                "skip",
                "debug"
            ]
        },
        security: {
            blacklist: config.blacklist,
            blockedWords: config.blockedWords
        },
        responses: convertedResponses
    }
    return newConfig;
}