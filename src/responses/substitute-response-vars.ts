import { StreamEvent } from "../stream-events/types.js";

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

export interface ISubstitutionMap {
    [key: string]: string
}

export function SubstituteStringVars(
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

function GetSubstitutionMapFromEvent(event: StreamEvent): ISubstitutionMap {
    return {
        'nickname': event.nickname || event.username,
        'subscriber.length': event.subscriber_length?.toString() || '',
        'subscriber.plural': ((event.subscriber_length ?? 0) > 1) ? 's' : '',
        'gift.receiver': event.gift_receiver || '',
        'gift.count': event.gift_count?.toString() || '',
        'raid.count': event.raid_count?.toString() || '',
        'raid.plural': ((event.raid_count ?? 0) > 1) ? 's' : '',
        'cheer.amount': event.cheer_amount?.toString() || '',
        'cheer.plural': ((event.cheer_amount ?? 0) > 1) ? 's' : '',
        'message.text': event.message?.text || '',
    };
}
