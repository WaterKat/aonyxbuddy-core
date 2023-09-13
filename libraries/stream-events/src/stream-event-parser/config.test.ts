import * as StreamEventParserConfigs from './istream-event-parser-config.js';

export const StreamEventParserConfigExample: StreamEventParserConfigs.IStreamEventParserConfig = {
    responses: {
        chat : {
            follow: ['Thank you for the follow, ${nickname}.'],
            subscriber: ['Thank you for the subscription, ${nickname}.'],
            "gift-single": ['Thank you for gifting a subscription, ${nickname}. ${gift.receiver} enjoy your stay.'],
            "gift-bulk-sent": ['Thank you for gifting ${gift.count} subscriptions ${nickname}.'],
            "gift-bulk-received": [],
            raid: ['Thank you for the raid ${nickname}.'],
            cheer: ['Thank you for the ${cheer.amount} bits, ${nickname}'],
            chat: [],
            command: [],
            redeem: ['Thank you for redeeming ${redeem.id}, ${nickname}'],
            "chat-first" : ['Welcome to the stream ${nickname}.']
        },
        voice : {
            follow: ['Thank you for the follow, ${nickname}.'],
            subscriber: ['Thank you for the subscription, ${nickname}.'],
            "gift-single": ['Thank you for gifting a subscription, ${nickname}. ${gift.receiver} enjoy your stay.'],
            "gift-bulk-sent": ['Thank you for gifting ${gift.count} subscriptions ${nickname}.'],
            "gift-bulk-received": [],
            raid: ['Thank you for the raid ${nickname}.'],
            cheer: ['Thank you for the ${cheer.amount} bits, ${nickname}'],
            chat: [],
            command: [],
            redeem: ['Thank you for redeeming ${redeem.id}, ${nickname}'],
            "chat-first" : ['Welcome to the stream ${nickname}.']
        },
    }
}
