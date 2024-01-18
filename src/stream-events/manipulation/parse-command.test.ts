import { expect, test } from "bun:test";
import pino from "pino";
const logger = pino();
import * as ParseCommandModule from "./parse-command.js";
import { StreamEvent, StreamEventType } from "../types.js";

test.skip("ParseCommand: Command NO aliases", () => {
    const commandChatStreamEvent: StreamEvent = {
        tstype: StreamEventType.TS_TYPE,
        type: StreamEventType.CHAT,
        username: "aonyxbuddy",
        message: {
            emotes: [],
            text: "!aonyxbuddy say hello world!"
        }
    }

    expect(ParseCommandModule.ParseCommand(commandChatStreamEvent, ["!aonyxbuddy@~"], ["mute", "say@~,speak,talk"]))
        .toStrictEqual({
            tstype: StreamEventType.TS_TYPE,
            type: StreamEventType.COMMAND,
            username: "aonyxbuddy",
            message: {
                emotes: [],
                text: "!aonyxbuddy say hello world!"
            },
            command: {
                prefix: "!aonyxbuddy",
                action: "say",
                args: "hello world!"
            }
        });
});

test.skip("ParseCommand: Command with aliases", () => {
    const commandChatStreamEvent: StreamEvent = {
        tstype: StreamEventType.TS_TYPE,
        type: StreamEventType.CHAT,
        username: "aonyxbuddy",
        message: {
            emotes: [],
            text: "~~hello world!"
        }
    }

    expect(ParseCommandModule.ParseCommand(commandChatStreamEvent, ["!aonyxbuddy@~"], ["mute", "say@~,speak,talk"]))
        .toStrictEqual({
            tstype: StreamEventType.TS_TYPE,
            type: StreamEventType.COMMAND,
            username: "aonyxbuddy",
            message: {
                emotes: [],
                text: "~~hello world!"
            },
            command: {
                prefix: "!aonyxbuddy",
                action: "say",
                args: "hello world!"
            }
        });
});