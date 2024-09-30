import { Logger } from "../logger-monad.js";
import { TStreamEvent, EStreamEventType, IsTMessageEvent } from "../types.js";

/**
 * The options for the ProcessCommand function
 */
export interface ProcessCommandOptions {
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
 * Nonstandard unicodes regex, used to remove nonstandard unicodes from a
 * string
 */
const NonstandardUnicodesRegex: RegExp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

/**
 * Creates a function that processes a command from a message event,
 * using the provided options. If the options are not provided or empty,
 * the function will return a logger with a log message stating that the
 * options are not provided or empty.
 * @param options The options for the function creation
 * @returns a function that processes a command from a message event
 */
export function GetProcessCommandFunction(
    options?: ProcessCommandOptions
): (event: TStreamEvent) => Logger<TStreamEvent> {
    if (
        !options
        || !options.identifiers || options.identifiers.length === 0
        || !options.actions || options.actions.length === 0
    ) {
        return function (event: TStreamEvent): Logger<TStreamEvent> {
            return new Logger(event, ["options not provided or empty"]);
        }
    }

    return function (event: TStreamEvent): Logger<TStreamEvent> {
        if (!IsTMessageEvent(event))
            return new Logger(event, ["Not a message event"]);

        const cleanedText = event.message.text
            .replace(WhitespacesRegex, " ")
            .replace(NonstandardUnicodesRegex, "")
            .trim();
        const identifiers: string[] =
            options.identifiers;
        const validIdentifier: string | undefined = identifiers.find(
            (identifier) => cleanedText.startsWith(identifier)
        );

        if (!validIdentifier)
            return new Logger(event, ["No valid identifier"]);

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

        if (!validAlias)
            return new Logger(event, ["No valid alias"]);


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
            permissions: event.permissions,
            nickname: event.nickname,
            identifier: validIdentifier,
            group: validIdentifier,
            action: validAliasString,
            args: aliasRemovedText,
        }

        return new Logger(newCommand, ["Command processed"]);
    }
}