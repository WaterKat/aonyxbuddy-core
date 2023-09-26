import { Types } from '../index.js';

const AlphaNumericsRegex: RegExp = /^[a-zA-Z0-9]+$/;
const WhitespacesRegex: RegExp = /\s+/;
const NonstandardUnicodesRegex: RegExp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

const logs = false;

function log(...items: any) {
    if (logs)
        console.log(items);
}

export function ParseCommand(streamEvent: Types.StreamEvent, useRequestField?: boolean): Types.StreamEvent {
    const minimumMessageLength: number = useRequestField ? 4 : 2;

    if (streamEvent.type !== 'chat') {
        log('Not chat event');
        return streamEvent;
    }
    //
    let messageText: string = streamEvent.message.text;
    messageText = messageText.trim();

    //
    if (messageText.length < minimumMessageLength)
        return streamEvent;

    //
    const firstCharacter = messageText[0];
    if (AlphaNumericsRegex.test(firstCharacter)) {
        log('First character is alphanumeric, should be symbol');
        return streamEvent;
    }

    const commandIdentifier = firstCharacter;
    messageText = messageText.substring(1);

    //
    const words = messageText.split(WhitespacesRegex).filter(word => word !== "");
    log(words);
    let commandGroup: string;
    let commandRequest: string;
    let lastWord: string;

    if (useRequestField) {
        if (words.length < 2) {
            log('useRequestField is enabled, but less than two words');
            return streamEvent;
        } else {
            commandGroup = words[0];
            commandRequest = words[1];
            lastWord = words[1];
        }
    } else {
        if (words.length < 1) {
            log('less than one words');
            return streamEvent
        } else {
            commandGroup = words[0];
            commandRequest = '';
            lastWord = words[0];
        }
    }

    //
    const argsBeginningIndex = messageText.indexOf(lastWord) + lastWord.length;
    let commandArgs: string;
    if (argsBeginningIndex >= messageText.length) {
        commandArgs = '';
    } else {
        commandArgs = messageText.substring(argsBeginningIndex).replace(NonstandardUnicodesRegex, '');
    }

    //
    const newCommand: Types.StreamEvent = {
        ...streamEvent,
        type: 'command',
        command_identifier: commandIdentifier,
        command_group: commandGroup,
        command_request: commandRequest,
        command_args: commandArgs
    }

    return newCommand;
}