import { expect, test } from "bun:test";
import { TStreamEvent, EStreamEventType } from "../types.js";
import { 
    ProcessCommand,
    IProcessCommandOptions 
} from "./processor-get-command.js";
import { 
    ProcessNicknames,
    IProcessNicknamesOptions
} from "./processor-get-nickname.js";

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
        command_identifier: "!aonyxbuddy",
        command_group: "!aonyxbuddy",
        command_action: "debug",
        command_args: ""
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
        command_identifier: "!a",
        command_group: "!a",
        command_action: "debug",
        command_args: "testing"
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
        command_identifier: "!",
        command_group: "!",
        command_action: "say",
        command_args: "hello world!"
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

    const optionsA: IProcessNicknamesOptions = {
        nicknameMap: {
            "testuser": ["testuser", "testy", "test"]
        },
        getNumBetween01Func: () => 0.5
    };

    const resultA = ProcessNicknames(eventA, optionsA);
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

    const optionsB: IProcessNicknamesOptions = {
        nicknameMap: {
            "testuser": ["testuser", "testy", "test"]
        },
        getNumBetween01Func: () => 0.9
    };

    const resultB = ProcessNicknames(eventB, optionsB);
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

    const optionsC: IProcessNicknamesOptions = {
        nicknameMap: {
            "anotherNickname": ["notright", "notrighty1", "notrighty2"]
        },
        getNumBetween01Func: () => 0.9
    };

    const resultC = ProcessNicknames(eventC, optionsC);
    expect(resultC.nickname).toEqual("testuser");

});


