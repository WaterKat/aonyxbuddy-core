import { StreamEvent }  from "../../stream-events";
import { IEventPostProcessor } from "../ievent-handlers";

export default (function (_useRequestField = true, _enableLogging = false): IEventPostProcessor {
    const useRequestField: boolean = _useRequestField;
    const minimumMessageLength: number = _useRequestField? 4: 2;

    const AlphaNumericsRegex: RegExp = /^[a-zA-Z0-9]+$/;
    const WhitespacesRegex: RegExp = /\s+/;
    const NonstandardUnicodesRegex: RegExp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

    const enableLogging = _enableLogging;

    function log(...args: any) {
        if (enableLogging) {
            console.log(args);
        }
    }

    function process(_originalEvent: StreamEvent): StreamEvent {
        if (_originalEvent.type !== 'chat'){
            log('Not chat event');
            return _originalEvent;
        }
        //
        let messageText: string = _originalEvent.message.text;
        messageText = messageText.trim();

        //
        if (messageText.length < minimumMessageLength)
            return _originalEvent;

        //
        const firstCharacter = messageText[0];
        if (AlphaNumericsRegex.test(firstCharacter)){
            log('First character is alphanumeric, should be symbol');
            return _originalEvent;
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
                return _originalEvent;
            } else {
                commandGroup = words[0];
                commandRequest = words[1];
                lastWord = words[1];
            }
        } else {
            if (words.length < 1) {
                log('less than one words');
                return _originalEvent
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
        const newCommand: StreamEvent = {
            ..._originalEvent,
            type: 'command',
            command_identifier: commandIdentifier,
            command_group: commandGroup,
            command_request: commandRequest,
            command_args: commandArgs
        }

        return newCommand;
    }

    return {
        process
    }
});
