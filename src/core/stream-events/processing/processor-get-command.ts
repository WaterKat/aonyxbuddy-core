import { TStreamEvent, EStreamEventType } from "../types.js";

/**
 * Process Command options for the ProcessCommand function, 
 * these options determine behavior of the function.
 */
export interface IProcessCommandOptions {
    identifiers: string[],
    actions: string[]
}

/**
 * Alias interface for the ProcessCommand function, used when parsing the 
 * alias string into an object
 */
interface IAlias {
    action: string,
    aliases: string[]
}

/**
 * Whitespace regex, used to replace multiple whitespaces with a single space
 */
const WhitespacesRegex: RegExp = /\s+/;
/**
 * Nonstandard unicodes regex, used to remove nonstandard unicodes from a string
 */
const NonstandardUnicodesRegex: RegExp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

/**
 * ProcessCommand function, processes a chat event into a command event
 * returns an unmodified event if it is not a chat event
 * @param event The event to process
 * @param options The options for the process command function
 * @returns The processed event
 */
export function ProcessCommand(
    event: TStreamEvent,
    options: IProcessCommandOptions
): TStreamEvent {

    if (event.type !== EStreamEventType.CHAT) {
        return event;
    }

    const cleanedText = event.message.text
        .replace(WhitespacesRegex, " ")
        .replace(NonstandardUnicodesRegex, "")
        .trim();
    const identifiers: string[] =
        options.identifiers;
    const validIdentifier: string | undefined = identifiers.find(
        (identifier) => cleanedText.startsWith(identifier)
    );

    if (!validIdentifier) {
        return event;
    }

    const identifierRemovedText = cleanedText
        .substring(validIdentifier.length)
        .trim();

    const actions: string[] = options.actions ?? [];
    const aliases: IAlias[] = actions.map(
        (actionsString) => ({
            action: actionsString.split("@")[0],
            aliases: actionsString.split("@").join(",").split(",")
        })
    );
    const validAlias: IAlias | undefined = aliases.find(
        (alias) => alias.aliases.some(
            (alias) => identifierRemovedText.startsWith(alias)
        )
    );

    if (!validAlias) {
        return event;
    }

    const validAliasString = validAlias.action;
    const aliasRemovedText = identifierRemovedText
        .substring(
            validAlias.aliases.find(
                (alias) => identifierRemovedText.startsWith(alias)
            )?.length ?? 0
        )
        .trim();

    const newCommand: TStreamEvent = {
        tstype: event.tstype,
        type: EStreamEventType.COMMAND,
        username: event.username,
        nickname: event.nickname,
        command_identifier: validIdentifier,
        command_group: validIdentifier,
        command_action: validAliasString,
        command_args: aliasRemovedText,
    }

    return newCommand;
}
