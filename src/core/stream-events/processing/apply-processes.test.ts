import { expect, test } from "bun:test";

import { TStreamEvent, EStreamEventType } from "../types.js";

import {
    ProcessCommand,
    IProcessCommandOptions
} from "./processor-get-command.js";

import {
    ProcessGetNicknames,
    IProcessGetNicknamesOptions
} from "./processor-get-nickname.js";

import {
    ProcessEvent,
    IProcessEventOptions,
    EPermissionLevel
} from "./index.js";

test("ProcessCommand", () => {
    // Test A
    const eventA: TStreamEvent = {
        tstype: EStreamEventType.TS_TYPE,
        type: EStreamEventType.CHAT,
        username: "testuser",
        message: {
            text: "!aonyxbuddy debug",
            emotes: []
        }
    };
    const optionsA: IProcessCommandOptions = {
        identifiers: ["!aonyxbuddy"],
        actions: ["debug"]
    };
    const resultA = ProcessCommand(eventA, optionsA);
    const desiredEventA: TStreamEvent = {
        tstype: EStreamEventType.TS_TYPE,
        type: EStreamEventType.COMMAND,
        username: "testuser",
        identifier: "!aonyxbuddy",
        group: "!aonyxbuddy",
        action: "debug",
        args: ""
    };
    expect(resultA).toEqual(desiredEventA);

    // Test B
    const eventB: TStreamEvent = {
        tstype: EStreamEventType.TS_TYPE,
        type: EStreamEventType.CHAT,
        username: "testuser",
        message: {
            text: "!a deeboog testing",
            emotes: []
        }
    };
    const optionsB: IProcessCommandOptions = {
        identifiers: ["!a"],
        actions: ["debug@deeboog"]
    };
    const resultB = ProcessCommand(eventB, optionsB);
    const desiredEventB: TStreamEvent = {
        tstype: EStreamEventType.TS_TYPE,
        type: EStreamEventType.COMMAND,
        username: "testuser",
        identifier: "!a",
        group: "!a",
        action: "debug",
        args: "testing"
    };
    expect(resultB).toEqual(desiredEventB);

    // Test C
    const eventC: TStreamEvent = {
        tstype: EStreamEventType.TS_TYPE,
        type: EStreamEventType.CHAT,
        username: "testuser",
        message: {
            text: "!&&4 hello world!",
            emotes: []
        }
    };
    const optionsC: IProcessCommandOptions = {
        identifiers: ["!", "!sol"],
        actions: ["say@:,6,8,&&4,asdf"]
    };
    const resultC = ProcessCommand(eventC, optionsC);
    const desiredEventC: TStreamEvent = {
        tstype: EStreamEventType.TS_TYPE,
        type: EStreamEventType.COMMAND,
        username: "testuser",
        identifier: "!",
        group: "!",
        action: "say",
        args: "hello world!"
    };
    expect(resultC).toEqual(desiredEventC);
});

test("ProcessNickname", () => {
    // Test A
    const eventA: TStreamEvent = {
        tstype: EStreamEventType.TS_TYPE,
        type: EStreamEventType.CHAT,
        username: "testuser",
        message: {
            text: "!aonyxbuddy debug",
            emotes: []
        }
    };

    const optionsA: IProcessGetNicknamesOptions = {
        nicknameMap: {
            "testuser": ["testuser", "testy", "test"]
        },
        randomBetween01Func: () => 0.5
    };

    const resultA = ProcessGetNicknames(eventA, optionsA);
    expect(resultA.nickname).toEqual("testy");


    // Test B
    const eventB: TStreamEvent = {
        tstype: EStreamEventType.TS_TYPE,
        type: EStreamEventType.CHAT,
        username: "testuser",
        message: {
            text: "!aonyxbuddy debug",
            emotes: []
        }
    };

    const optionsB: IProcessGetNicknamesOptions = {
        nicknameMap: {
            "testuser": ["testuser", "testy", "test"]
        },
        randomBetween01Func: () => 0.9
    };

    const resultB = ProcessGetNicknames(eventB, optionsB);
    expect(resultB.nickname).toEqual("test");

    // Test C
    const eventC: TStreamEvent = {
        tstype: EStreamEventType.TS_TYPE,
        type: EStreamEventType.CHAT,
        username: "testuser",
        message: {
            text: "!aonyxbuddy debug",
            emotes: []
        }
    };

    const optionsC: IProcessGetNicknamesOptions = {
        nicknameMap: {
            "anotherNickname": ["notright", "notrighty1", "notrighty2"]
        },
        randomBetween01Func: () => 0.9
    };

    const resultC = ProcessGetNicknames(eventC, optionsC);
    expect(resultC.nickname).toEqual("testuser");

});

test("ProcessCommands", () => {
    const eventA: TStreamEvent = {
        tstype: EStreamEventType.TS_TYPE,
        type: EStreamEventType.CHAT,
        username: "adminuser",
        message: {
            text: "!aonyxbuddy debug",
            emotes: []
        }
    };

    const optionsA: IProcessEventOptions = {
        FilterBlacklistOptions: {
            blacklist: []
        },
        CommandOptions: {
            identifiers: ["!aonyxbuddy"],
            actions: ["debug"]
        },
        FilterBotlistOptions: {
            botlist: [],
            allow: []
        },
        FilterWordsCaseSensitiveOptions: {
            wordsToFilter: [],
            replacement: ""
        },
        FilterWordsCaseInsensitiveOptions: {
            wordsToFilter: [],
            replacement: ""
        },
        FilterEmojisOptions: {
            replacement: ""
        },
        GetNicknameOptions: {
            nicknameMap: {
                "adminuser": ["adminuserA", "adminuserB", "adminuserC"]
            },
            randomBetween01Func: () => 0.5
        },
        FilterPermissionsOptions: {
            permissionRequirements: {
                [EStreamEventType.TS_TYPE]: EPermissionLevel.CHATTER,
                [EStreamEventType.FOLLOW]: EPermissionLevel.CHATTER,
                [EStreamEventType.SUBSCRIBER]: EPermissionLevel.CHATTER,
                [EStreamEventType.GIFT_SINGLE]: EPermissionLevel.CHATTER,
                [EStreamEventType.GIFT_BULK_SENT]: EPermissionLevel.CHATTER,
                [EStreamEventType.GIFT_BULK_RECEIVED]:
                    EPermissionLevel.CHATTER,
                [EStreamEventType.RAID]: EPermissionLevel.CHATTER,
                [EStreamEventType.CHEER]: EPermissionLevel.CHATTER,
                [EStreamEventType.CHAT]: EPermissionLevel.CHATTER,
                [EStreamEventType.CHAT_FIRST]: EPermissionLevel.CHATTER,
                [EStreamEventType.COMMAND]: EPermissionLevel.MODERATOR,
                [EStreamEventType.REDEEM]: EPermissionLevel.CHATTER,
                [EStreamEventType.IGNORE]: EPermissionLevel.CHATTER,
                [EStreamEventType.OTHER]: EPermissionLevel.CHATTER
            },
            permissions: {
                "adminuser": EPermissionLevel.MODERATOR
            }
        }
    };

    const resultA = ProcessEvent(eventA, optionsA);
    console.log(resultA);
});
