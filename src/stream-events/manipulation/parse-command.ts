import pino from "pino";
const logger = pino();

import { AonyxBuddyStreamEvent, AonyxBuddyStreamEventTypes } from "@aonyxbuddy/stream-events";

const AlphaNumericsRegex: RegExp = /^[a-zA-Z0-9]+$/;
const WhitespacesRegex: RegExp = /\s+/;
const NonstandardUnicodesRegex: RegExp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

/**
 * Will take in a StreamEvent, and compare the provided prefixes and actions to see if the message value in the StreamEvent is a valid command.
 * If the StreamEvent is valid, a new Command StreamEvent will be returned, otherwise the original is returned.
 * @param streamEvent the input stream event to be checked for a command
 * @param prefixes an array of viable prefixes for commands, usually in the format "!prefix" or "#prefix"
 * @param actions an array of viable actions. aliases are defined by using "@" and then seperated by ","
 * ex: the "say@\~,speak,read" string defines an action "say" and alternative ways of calling it like "~", "speak", "read".
 * @returns a parsed command stream event if the input is a valid command, otherwise returns original stream event
 */
export function ParseCommand(streamEvent: AonyxBuddyStreamEvent, prefixes: string[], actions: string[]) : AonyxBuddyStreamEvent {
    if (streamEvent.type !== 'chat') {
        logger.info('Not chat event');
        return streamEvent;
    }

    let messageText: string = streamEvent.message.text;

    // prefix
    messageText = messageText.trim();

    let commandPrefix: string = "";
    let containsCommandPrefix: boolean = false;

    for (let i = 0; i < prefixes.length; i++) {
        const parsedPrefixes = actions[i].split('@');
        const prefix = parsedPrefixes[0] ?? "";
        const prefixAliases = (parsedPrefixes[1] ?? "").split(',');
        parsedPrefixes.push(prefix);

        let commandPrefixAlias = "";
        let containPrefixAlias = false;
        for (let j = 0; j < prefixAliases.length; j++) {
            const alias = prefixAliases[j];
            if (alias.length < 1) continue;
            if (messageText.startsWith(alias)) {
                messageText = messageText.substring(alias.length);
                commandPrefixAlias = alias;
                containPrefixAlias = true;
                break;
            }
        }

        if (containPrefixAlias) {
            commandPrefix = prefix;
            containsCommandPrefix = true;
            break;
        }
    }

    if (!containsCommandPrefix) {
        logger.info('Does not contain prefix');
        return streamEvent;
    }

    // actions
    messageText = messageText.trim();

    let commandAction: string = "";
    let containsCommandAction: boolean = false;

    for (let i = 0; i < actions.length; i++) {
        const parsedActions = actions[i].split('@');
        const action = parsedActions[0] ?? "";
        const actionAliases = (parsedActions[1] ?? "").split(',');
        actionAliases.push(action);

        let commandActionAlias = "";
        let containsActionAlias = false;
        for (let j = 0; j < actionAliases.length; j++) {
            const alias = actionAliases[j];
            if (alias.length < 1) continue;
            if (messageText.startsWith(alias)) {
                messageText = messageText.substring(alias.length);
                commandActionAlias = alias;
                containsActionAlias = true;
                break;
            }
        }

        if (containsActionAlias) {
            commandAction = action;
            containsCommandAction = true;
            break;
        }
    }

    if (!containsCommandAction) {
        logger.info('Does not contain action');
        return streamEvent;
    }
    
    // args
    messageText = messageText.trim();

    // return
    const commandStreamEvent : AonyxBuddyStreamEvent = {
        ...streamEvent,
        type: AonyxBuddyStreamEventTypes.COMMAND,
        command : {
            prefix : commandPrefix,
            action : commandAction,
            args : messageText
        }
    }

    return commandStreamEvent;
}
