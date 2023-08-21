import { StreamEvent } from '../stream-events';
import * as StreamEventParserConfigs from './istream-event-parser-config';

export class StreamEventParser {
    options: StreamEventParserConfigs.IStreamEventParserConfig;

    constructor(options: StreamEventParserConfigs.IStreamEventParserConfig) {
        this.options = options;
    }

    GetVoiceResponse(event: StreamEvent): string {
        let rawResponse = this.GetRandomResponse(event, this.options.responses.voice);
        const variables = StreamEventParser.GetVariablReplacements(event);
        for (const key in variables) {
            rawResponse = StreamEventParser
                .ReplacePlaceholderWithString(rawResponse, key, variables[key]);
        }
        return rawResponse;
    }

    GetChatResponse(event: StreamEvent): string {
        let rawResponse = this.GetRandomResponse(event, this.options.responses.chat);
        const variables = StreamEventParser.GetVariablReplacements(event);
        for (const key in variables) {
            rawResponse = StreamEventParser
                .ReplacePlaceholderWithString(rawResponse, key, variables[key]);
        }
        return rawResponse;
    }

    private static GetVariablReplacements(event: StreamEvent): StreamEventParserConfigs.IStreamEventParserComponents.IVariableReplacements {
        return {
            'nickname': event.nickname || event.username,
            'subscriber.length' : event.subscriber_length?.toString() || '',
            'gift.receiver': event.gift_receiver || '',
            'gift.count': event.gift_count?.toString() || '',
            'raid.count': event.raid_count?.toString() || '',
            'cheer.amount': event.cheer_amount?.toString() || '',
            'message.text' : event.message?.text || '',
        };
    }

    private static ReplacePlaceholderWithString(text: string, key: string, replacement: string): string {
        const placeholderRegex = new RegExp(`\\$\\{\\s*${key}\\s*\\}`, 'g');
        const replacedString = text.replace(placeholderRegex, replacement);
        return replacedString;
    }

    private GetRandomResponse(event: StreamEvent, responseArray: typeof this.options.responses.voice) {
        let searchID: string = event.type;

        if (event.type === 'custom') {
            searchID = event.custom_id;
        }

        const responses = responseArray[searchID];

        if (!responses || !Array.isArray(responses) || responses.length < 1) return '';

        const randomResponseIndex = Math.floor(Math.random() * responses.length);
        return responses[randomResponseIndex];
    }
}
