import { Logger } from "./logger-monad.js";

import {
    GetFilterBlacklistFunction, FilterBlacklistOptions,
    GetProcessCommandFunction, ProcessCommandOptions,
    GetFilterBotlistFunction, FilterBotlistOptions,
    GetFilterCaseSensitiveFunction, FilterWordsOptions,
    GetFilterCaseInsensitiveFunction,
    GetFilterEmojisFunction, FilterEmojisOptions,
    GetFilterCheermotesFunction, FilterCheermotesOptions,
    GetValidateFunction, ValidateOptions,
    GetFilterPermissionsFunction, FilterPermissionsOptions,
    GetNicknamesFunction, NicknamesOptions
} from "./processing/index.js";

import {
    GetFilterConditionFunction, FilterConditionOptions
} from "./custom-processing/filter-condition.js";

import { TStreamEvent } from "./types";

export type ProcessEventOptions = {
    conditionOptions?: FilterConditionOptions,
    validateOptions?: ValidateOptions,
    blacklistOptions?: FilterBlacklistOptions,
    commandOptions?: ProcessCommandOptions,
    botlistOptions?: FilterBotlistOptions,
    caseSensitiveOptions?: FilterWordsOptions,
    caseInsensitiveOptions?: FilterWordsOptions,
    emojisOptions?: FilterEmojisOptions,
    cheerOptions?: FilterCheermotesOptions,
    nicknamesOptions?: NicknamesOptions,
    permissionsOptions?: FilterPermissionsOptions
};

export function GetProcessEventFunction(
    options: ProcessEventOptions
): (event: TStreamEvent) => Logger<TStreamEvent> {
    const filterCondition =
        GetFilterConditionFunction(options.conditionOptions);
    const validateEvent = GetValidateFunction(options.validateOptions);
    const filterBlacklist =
        GetFilterBlacklistFunction(options.blacklistOptions);
    const processCommand = GetProcessCommandFunction(options.commandOptions);
    const filterBotlist = GetFilterBotlistFunction(options.botlistOptions);
    const filterCaseSensitive =
        GetFilterCaseSensitiveFunction(options.caseSensitiveOptions);
    const filterCaseInsensitive =
        GetFilterCaseInsensitiveFunction(options.caseInsensitiveOptions);
    const filterEmojis = GetFilterEmojisFunction(options.emojisOptions);
    const filterCheermotes = GetFilterCheermotesFunction(options.cheerOptions);
    const getNicknames = GetNicknamesFunction(options.nicknamesOptions);
    const filterPermissions =
        GetFilterPermissionsFunction(options.permissionsOptions);

    return function (event: TStreamEvent) {
        const loggedEvent = new Logger(event).log("ProcessEvent:\n")
//            .log("FilterCondition: ").map(filterCondition)
            .log("ValidateEvent: ").map(validateEvent)
            .log("FilterBlacklist: ").map(filterBlacklist)
            .log("ProcessCommand: ").map(processCommand)
            .log("FilterBotlist: ").map(filterBotlist)
            .log("ProcessCaseSensitive: ").map(filterCaseSensitive)
            .log("ProcessCaseInsensitive: ").map(filterCaseInsensitive)
            .log("FilterEmojis: ").map(filterEmojis)
            .log("FilterCheermotes: ").map(filterCheermotes)
            .log("GetNicknames: ").map(getNicknames)
            .log("FilterPermissions: ").map(filterPermissions)
        return loggedEvent;
    }
}




