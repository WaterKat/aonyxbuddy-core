import { IClientConfig } from './iclient-config.js';
import ChuckBase64Sprites from './base64-sprites/chuck.js';
import DefaultBlockedWords from './blocked-words/default.js';

export const ClientConfigExample: IClientConfig = {
    id: 'cupidjpeg',
    name: 'chuck',
    webSocketToken: '',
    commandIdentifier: '!',
    commandGroup: 'chuck',
    blacklist: [],
    botlist: [
        'nightbot',
        'streamelements',
        'soundalerts',
        'streamlabs',
        'botterkat',
        'kofistreambot',
        'elbierro',
        'pokemoncommunitygame',
    ],
    blockedWords: DefaultBlockedWords,
    spriteRendering: {
        canvas: {
            size: {
                x: 400,
                y: 600
            },
            antialiasing: true
        },
        defaultFPS: 60,
        sprites: ChuckBase64Sprites
    },
    nicknames: {
        'waterkattv': ['waterkat', 'the cat'],
        'fariaorion': ['faria'],
        'alexr118': ['alex'],
        'cupidjpeg': ['cupid', 'cutie', 'sexy beast'],
        'ssptaicho': ['Thai Cho']
    },
    tts: { voice: 'Matthew' },
    responses: {
        chat: {
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
            "chat-first": ['Welcome to the stream ${nickname}.']
        },
        voice: {
            follow: [
                "Thanks for following, ${nickname}! Dive into the digital dreamscape!",
                "Hey ${nickname}, you're now surfing the vaporwave! Stay wavy!",
                "Appreciate the follow, ${nickname}! Let's ride the retro waves together!"
            ],
            subscriber: [
                "Thanks ${nickname} for ${subscriber.length} month${subscriber.plural} in our digital utopia!",
                "Vapor vibes to ${nickname} for ${subscriber.length} month${subscriber.plural} of neon nostalgia!",
                "Retro cheers, ${nickname}! Celebrating ${subscriber.length} month${subscriber.plural} of surreal surfing!"
            ],
            raid: [
                "Neon raid incoming! Welcome ${nickname} and ${raid.count} digital dreamers!",
                "Retro alert! Thanks ${nickname} for leading ${raid.count} raiders into our vaporwave vision!"
            ],
            cheer: ['Thank you for the ${cheer.amount} bits, ${nickname}'],
            chat: [],
            command: [],
            redeem: ['Thank you for redeeming ${redeem.id}, ${nickname}'],
            "gift-single": [
                "Neon thanks to ${nickname} for the rad gift! Welcome to the vaporwave, ${gift.receiver}!",
                "Shoutout to ${nickname} for gifting a ticket to the retro realm! Enjoy, ${gift.receiver}!"
            ],
            "gift-bulk-sent": [
                "Epic neon blast from ${nickname}! Thanks for gifting ${gift.count} passes to the vaporwave paradise!"
            ],
            "chat-first": [
                "Hey ${nickname}! Welcome to the chat! Let's make some retro waves!",
                "Greetings, ${nickname}! The digital lounge is brighter with you here!",
                "Welcome to the neon realm, ${nickname}! Enjoy the retro vibes!",
            ],
            "event-subscriber-message": [
                "${nickname} says... ${message.text}"
            ],
            "command-say": [
                "${message.text}"
            ]
        }
    }
}
