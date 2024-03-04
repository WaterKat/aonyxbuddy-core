import { TStreamEvent } from "../types.js";
import {
    ProcessFilterWordsCaseSensitive,
    ProcessFilterWordsCaseInsensitive
} from "./processor-filter-words.js";
import {
    ProcessCommand,
    IProcessCommandOptions
} from "./processor-get-command.js"
import {
    ProcessNicknames,
    IProcessNicknamesOptions
} from "./processor-get-nickname.js";
import { 
    ProcessorFilterBlacklist,
    IProcessFilterBlacklistOptions
} from "./processor-filter-blacklist.js";
import { 
    ProcessorFilterEmojis,
    IProcessFilterEmojisOptions
} from "./processor-filter-emojis.js";
import { 
    ProcessorIgnoreBotlist,
    IProcessorIgnoreBotlistOptions
} from "./processor-filter-botlist.js";
import {
    ProcessFilterPermissions,
    IProcessFilterPermissionsOptions
} from "./processor-filter-permissions.js";

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
    filterCaseSensitive?: string[],
    filterCaseInsensitive?: string[],
    processCommandOptions?: IProcessCommandOptions,
    processNicknamesOptions?: IProcessNicknamesOptions,
    processFilterBlacklistOptions?: IProcessFilterBlacklistOptions,
    processFilterEmojisOptions?: IProcessFilterEmojisOptions,
    processIgnoreBotlistOptions?: IProcessorIgnoreBotlistOptions,
    processFilterPermissionsOptions?: IProcessFilterPermissionsOptions
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
            funcOptions: options.processFilterBlacklistOptions
        },
        {
            func: ProcessCommand,
            funcOptions: options.processCommandOptions
        },
        {
            func: ProcessorIgnoreBotlist,
            funcOptions: options.processIgnoreBotlistOptions
        },
        {
            func: ProcessFilterWordsCaseSensitive,
            funcOptions: options.filterCaseSensitive
        },
        {
            func: ProcessFilterWordsCaseInsensitive,
            funcOptions: options.filterCaseInsensitive
        },
        {
            func: ProcessorFilterEmojis,
            funcOptions: options.processFilterEmojisOptions
        },
        {
            func: ProcessNicknames,
            funcOptions: options.processNicknamesOptions
        }, 
        {
            func: ProcessFilterPermissions,
            funcOptions: options.processFilterPermissionsOptions   
        }
    ];
    return filters.reduce(
        (workingEvent, filter) =>
            ApplyEventProcessor(workingEvent, filter),
        event
    );
};

