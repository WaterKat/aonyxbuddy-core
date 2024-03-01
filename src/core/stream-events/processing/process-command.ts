import { StreamEvent, StreamEventType } from "../types.js";

interface IProcessCommandOptions {
    commandIdentifiers?: string[]
}

const WhitespacesRegex: RegExp = /\s+/;

export function ProcessCommand(
    event: StreamEvent,
    options: IProcessCommandOptions
): StreamEvent {

    if (event.type !== StreamEventType.CHAT) {
        return {
            ...event
        };
    }

    let workingText = event.message.text;
    workingText = workingText.replace(WhitespacesRegex, " ");
    workingText = workingText.trim();

    let commandIdentifierValid: boolean = false;
    const identifiers: string[] = options.commandIdentifiers ?? ["!"];
    for (let i = 0; i < identifiers.length; i++) {
        if (workingText.startsWith(identifiers[i])) {
            commandIdentifierValid = true;
            workingText = workingText.substring(identifiers[i].length);
            break;
        }
    }

    if (!commandIdentifierValid) {
        return {
            ...event
        };
    }

    //TODO: Implement command parsing

}