/**
 * This enum is used to define the string variable IDs or keys
 * that can be used in the substitution map. The substitution map is used to 
 * replace the string variables with the actual values provided.
 */
export enum StringVariableIDs {
    NICKNAME = "nickname",
    SUBSCRIBER_LENGTH = "subscriber.length",
    SUBSCRIBER_LENGTH_PLURAL = "subscriber.plural",
    GIFT_RECEIVER = "gift.receiver",
    GIFT_COUNT = "gift.count",
    GIFT_COUNT_PLURAL = "gift.count.plural",
    RAID_COUNT = "raid.count",
    RAID_COUNT_PLURAL = "raid.plural",
    CHEER_COUNT = "cheer.amount",
    CHEER_COUNT_PLURAL = "cheer.plural",
    MESSAGE_TEXT = "message.text"
}

/**
 * This interface is used to define the substitution map that is used to replace
 * the string variables with the actual values provided.
 */
export interface ISubstitutionMap {
    [key: string]: string
}

/**
 * This function is used to substitute a string variable with a value in a given
 * text. The text is the string that contains the string variable to be replaced.
 * The varID is the string variable ID or key that is used to identify the string
 * variable to be replaced. The substitution is the value that is used to replace
 * the string variable in the text.
 * @param text the text to substitute the string variable in
 * @param varID the string variable ID or key to identify the string variable
 * @param subsitution the value to replace the string variable with
 * @returns the text with the string variable replaced with the value
 */
export function SubstituteStringVar(
    text: string, varID: string, subsitution: string
): string {
    const placeholderRegex =
        new RegExp(
            `\\$\\{\\s*${varID}\\s*\\}`,
            'g'
        );
    const replacedString = text.replace(
        placeholderRegex,
        subsitution
    );
    return replacedString;
}

/**
 * This function is used to substitute all the string variables in a given text
 * with the values provided in the substitution map. 
 * @param substitutionMap a map of keys and values that are used to replace the
 * string variables in the text
 * @param text the text to substitute the string variables in
 * @returns the text with the string variables replaced with the values provided 
 */
export function SubstuteAllInSubstitutionMap(
    substitutionMap: ISubstitutionMap,
    text: string
) : string {
    let processedText = text;
    for (const key in  substitutionMap) {
        processedText = SubstituteStringVar(processedText, key, substitutionMap[key]);
    }
    return processedText;
}