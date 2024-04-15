import { Types } from '../core/stream-events/index.js';
import { EStreamEventType } from '../core/stream-events/stream-events.js';
import { IResponses } from './types';

export function GetResponse(responses: IResponses, event: Types.TStreamEvent, key: string, typeOverride?: string){
    const type = typeOverride ?? event.type;

    if (!responses[key] || !responses[key][type] || responses[key][type].length < 1)
        return '';

    let rawResponse = GetRandomResponse(responses[key][type]);

    const variables = GetVariablReplacements(event);
    for (const key in  variables) {
        rawResponse = ReplacePlaceholderWithString(rawResponse, key, variables[key]);
    }
    return rawResponse;
}

function GetRandomResponse(responseArray: string[]) {
    const randomResponseIndex = Math.floor(Math.random() * responseArray.length);
    return responseArray[randomResponseIndex];
}

function GetVariablReplacements(event: Types.TStreamEvent) : {[key: string]: string} {
    return {
        "nickname": event.nickname ?? event.username,
        "subscriber.length": event.type === EStreamEventType.SUBSCRIBER ?
            event.length.toString() : "",
        "subscriber.plural": event.type === EStreamEventType.SUBSCRIBER ?
            ((event.length ?? 0) > 1) ? "s" : "" : "",
        "gift.receiver": event.type === EStreamEventType.GIFT_BULK_RECEIVED ?
            event.receiver ?? "" : "",
        "gift.count": event.type === EStreamEventType.GIFT_BULK_SENT ?
            event.count.toString() ?? "" : "",
        "raid.count": event.type === EStreamEventType.RAID ?
            event.count.toString() ?? "" : "",
        "raid.plural": event.type === EStreamEventType.RAID ?
            ((event.count ?? 0) > 1) ? "s" : "" : "",
        "cheer.amount": event.type === EStreamEventType.CHEER ?
            event.amount.toString() || "" : "",
        "cheer.plural": event.type === EStreamEventType.CHEER ?
            ((event.amount ?? 0) > 1) ? "s" : "" : "",
        "message.text": event.type === EStreamEventType.CHAT ||
            event.type === EStreamEventType.CHAT_FIRST ||
            event.type === EStreamEventType.CHEER ?
            event.message.text ?? "" : "",
    };
}

function ReplacePlaceholderWithString(text: string, key: string, replacement: string): string {
    const placeholderRegex = new RegExp(`\\$\\{\\s*${key}\\s*\\}`, 'g');
    const replacedString = text.replace(placeholderRegex, replacement);
    return replacedString;
}