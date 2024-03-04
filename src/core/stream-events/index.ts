export * as Types from './types.js';
export * as Detection from './old.detection/index.js';
export * as Manipulation from './old.manipulation/index.js';

export { 
    TStreamEvent,
    TChatMessage,
    TEmote,
    TPermissions,
    EStreamEventType
} from './types.js';

export {
    ProcessEvent,
    IProcessEventOptions,
    ProcessorFilterBlacklist,
    IProcessFilterBlacklistOptions,
    ProcessorIgnoreBotlist,
    IProcessorIgnoreBotlistOptions,
    ProcessorFilterCheermotes,
    IProcessorFilterCheermotesOptions,
    ProcessFilterCondition,
    IProcessFilterConditionOptions,
    ProcessorFilterEmojis,
    IProcessFilterEmojisOptions,
    ProcessFilterPermissions,
    IProcessFilterPermissionsOptions,
    ProcessFilterWordsCaseSensitive,
    ProcessFilterWordsCaseInsensitive,
    IProcessFilterWordsOptions,
    ProcessCommand,
    IProcessCommandOptions,
    ProcessNicknames,
    IProcessNicknamesOptions
} from "./processing/index.js"

import { ProcessEvent } from './processing/index.js';
export default ProcessEvent;
