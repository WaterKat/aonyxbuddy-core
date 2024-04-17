import { ProcessEventOptions } from "./template.js";
import { EStreamEventType } from "./types.js";
import { EPermissionLevel } from "./processing/filter-permissions.js";

/**
 * The legacy configuration type, containing the canvas size, antialiasing
 * setting, default frames per second, and the sprites configuration.
 */
export interface ILegacyConfig {
    owner_id: string,
    nickname: string,
    nicknames: { [key: string]: string[] },
    blacklist: string[],
    botlist: string[],
    blockedWords: string[],
}

/**
 * Checks if the value is a legacy configuration object.
 * @param value the value to check if it is a object
 */
export function IsLegacyEventProcessorConfig(
    value: any | ILegacyConfig
): value is ILegacyConfig {
    if (typeof value !== "object") return false;
    if (typeof value.owner_id !== "string") return false;
    if (typeof value.nickname !== "string") return false;
    if (typeof value.nicknames !== "object") return false;
    if (typeof value.blacklist !== "object") return false;
    if (typeof value.botlist !== "object") return false;
    if (typeof value.blockedWords !== "object") return false;
    return true;
}

/**
 * Converts a legacy configuration to the new configuration type.
 * @param legacyConfig the legacy configuration to convert
 * @returns the new configuration type
 */
export function ConvertLegacyProcessorConfig(
    config: ILegacyConfig
): ProcessEventOptions {
    const processEventOptions: ProcessEventOptions = {
        caseInsensitiveOptions: {
            wordsToFilter: config.blockedWords,
            replacement: ""
        },
        validateOptions: {
            lowercase: true
        },
        caseSensitiveOptions: {
            wordsToFilter: [],
            replacement: ""
        },
        commandOptions: {
            identifiers: ["!aonyxbuddy", `!${config.nickname}`, "!!"],
            actions: ["debug", "say@:", "mute", "unmute", "skip@>"]
        },
        nicknamesOptions: {
            nicknameMap: config.nicknames,
            randomBetween01Func: Math.random
        },
        blacklistOptions: {
            blacklist: config.blacklist
        },
        emojisOptions: {
            filter: true,
            replacement: ""
        },
        botlistOptions: {
            botlist: config.botlist,
            allow: [EStreamEventType.COMMAND]
        },
        permissionsOptions: {
            permissionRequirements: {
                [EStreamEventType.TS_TYPE]: EPermissionLevel.CHATTER,
                [EStreamEventType.CHAT]: EPermissionLevel.CHATTER,
                [EStreamEventType.CHAT_FIRST]:
                    EPermissionLevel.FOLLOWER,
                [EStreamEventType.CHEER]: EPermissionLevel.CHATTER,
                [EStreamEventType.SUBSCRIBER]:
                    EPermissionLevel.CHATTER,
                [EStreamEventType.FOLLOW]: EPermissionLevel.CHATTER,
                [EStreamEventType.RAID]: EPermissionLevel.CHATTER,
                [EStreamEventType.GIFT_BULK_RECEIVED]:
                    EPermissionLevel.CHATTER,
                [EStreamEventType.GIFT_BULK_SENT]:
                    EPermissionLevel.CHATTER,
                [EStreamEventType.GIFT_SINGLE]:
                    EPermissionLevel.CHATTER,
                [EStreamEventType.COMMAND]: EPermissionLevel.MODERATOR,
                [EStreamEventType.REDEEM]: EPermissionLevel.CHATTER,
                [EStreamEventType.IGNORE]: EPermissionLevel.CHATTER,
                [EStreamEventType.OTHER]: EPermissionLevel.CHATTER,
            },
            permissions: {
                [config.owner_id]: EPermissionLevel.STREAMER,
                "aonyxbuddy": EPermissionLevel.MODERATOR
            }
        },
        cheerOptions: {
            filter: true,
            replacement: ""
        },
        conditionOptions: {
            condition: true,
        }
    };

    return processEventOptions;
}
