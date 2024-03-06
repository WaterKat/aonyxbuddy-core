import { TStreamEvent } from "../types.js";
import {
    ProcessorFilterBlacklist,
    IProcessFilterBlacklistOptions
} from "./processor-filter-blacklist.js";
import {
    ProcessorFilterBotlist,
    IProcessorFilterBotlistOptions
} from "./processor-filter-botlist.js";
import {
    ProcessFilterWordsCaseSensitive,
    ProcessFilterWordsCaseInsensitive,
    IProcessFilterWordsOptions
} from "./processor-filter-words.js";
import {
    ProcessCommand,
    IProcessCommandOptions
} from "./processor-get-command.js"
import {
    ProcessGetNicknames,
    IProcessGetNicknamesOptions
} from "./processor-get-nickname.js";
import {
    ProcessorFilterEmojis,
    IProcessFilterEmojisOptions
} from "./processor-filter-emojis.js";
import {
    ProcessFilterPermissions,
    IProcessFilterPermissionsOptions
} from "./processor-filter-permissions.js";
import {
     ProcessorFilterCheermotes,
     IProcessorFilterCheermotesOptions
 } from "./processor-filter-cheermotes.js";
 import { 
    ProcessFilterCondition,
    IProcessFilterConditionOptions
 } from "./processor-filter-condition.js";


/**
 * Options for processing a stream event. For use when constructing the 
 * ApplyEventProcessor function array for ProcessEvent
 */
interface IApplyEventProcessorOptions<TOptions> {
    func: (
        event: TStreamEvent,
        options: TOptions
    ) => TStreamEvent,
    funcOptions?: TOptions
}

/**
 * Applies a process function to a stream event with the given options if the 
 * options are defined, and returns the processed event. If the options are not
 * defined, the event is returned unmodified.
 * @param event the event to process
 * @param processFunc the function to process the event with
 * @param processOptions the options for processing the event
 * @returns the processed event, or the unmodified event if the options are not
 * defined
 */
const ApplyEventProcessor = (
    event: TStreamEvent,
    options: IApplyEventProcessorOptions<any>
) => (
    options.funcOptions ? options.func(event, options.funcOptions) : event
);

/**
 * Options for processing a stream event
 */
export interface IProcessEventOptions {
    FilterWordsCaseInsensitiveOptions?: IProcessFilterWordsOptions,
    FilterWordsCaseSensitiveOptions?: IProcessFilterWordsOptions,
    CommandOptions?: IProcessCommandOptions,
    GetNicknameOptions?: IProcessGetNicknamesOptions,
    FilterBlacklistOptions?: IProcessFilterBlacklistOptions,
    FilterEmojisOptions?: IProcessFilterEmojisOptions,
    FilterBotlistOptions?: IProcessorFilterBotlistOptions,
    FilterPermissionsOptions?: IProcessFilterPermissionsOptions,
    FilterCheermotesOptions?: IProcessorFilterCheermotesOptions,
    FilterConditionOptions?: IProcessFilterConditionOptions
}

/**
 * Processes a stream event with the given options, and returns the processed 
 * event 
 * @param event event to apply processing to
 * @param options options for processing the event 
 * @returns the processed event
 */
export const ProcessEvent = (
    event: TStreamEvent,
    options: IProcessEventOptions
) => {
    const filters = [
        {
            func: ProcessorFilterBlacklist,
            funcOptions: options.FilterBlacklistOptions
        },
        {
            func: ProcessCommand,
            funcOptions: options.CommandOptions
        },
        {
            func: ProcessorFilterBotlist,
            funcOptions: options.FilterBotlistOptions
        },
        {
            func: ProcessFilterWordsCaseSensitive,
            funcOptions: options.FilterWordsCaseSensitiveOptions
        },
        {
            func: ProcessFilterWordsCaseInsensitive,
            funcOptions: options.FilterWordsCaseInsensitiveOptions
        },
        {
            func: ProcessorFilterEmojis,
            funcOptions: options.FilterEmojisOptions
        },
        {
            func: ProcessorFilterCheermotes,
            funcOtions: options.FilterCheermotesOptions
        },
        {
            func: ProcessGetNicknames,
            funcOptions: options.GetNicknameOptions
        },
        {
            func: ProcessFilterPermissions,
            funcOptions: options.FilterPermissionsOptions
        },
        {
            func: ProcessFilterCondition,
            funcOptions: options.FilterConditionOptions
        }
    ];
    return filters.reduce(
        (workingEvent, filter) =>
            ApplyEventProcessor(workingEvent, filter),
        event
    );
};

