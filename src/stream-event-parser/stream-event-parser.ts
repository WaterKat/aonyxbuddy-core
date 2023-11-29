import { Types } from '@aonyxbuddy/stream-events';
import { IResponses } from './types';

export function GetResponse(responses: IResponses, event: Types.StreamEvent, key: string, typeOverride?: string){
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

function GetVariablReplacements(event: Types.StreamEvent) : {[key: string]: string} {
    return {
        'nickname': event.nickname || event.username,
        'subscriber.length' : event.subscriber_length?.toString() || '',
        'subscriber.plural' : ((event.subscriber_length ?? 0) > 1) ? 's' : '',
        'gift.receiver': event.gift_receiver || '',
        'gift.count': event.gift_count?.toString() || '',
        'raid.count': event.raid_count?.toString() || '',
        'raid.plural': ((event.raid_count ?? 0) > 1) ? 's' : '',
        'cheer.amount': event.cheer_amount?.toString() || '',
        'cheer.plural': ((event.cheer_amount ?? 0) > 1) ? 's' : '',
        'message.text' : event.message?.text || '',
    };
}

function ReplacePlaceholderWithString(text: string, key: string, replacement: string): string {
    const placeholderRegex = new RegExp(`\\$\\{\\s*${key}\\s*\\}`, 'g');
    const replacedString = text.replace(placeholderRegex, replacement);
    return replacedString;
}