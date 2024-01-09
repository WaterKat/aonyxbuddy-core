import { IClientConfig } from './iclient-config.js';
import ChuckBase64Sprites from './base64-sprites/chuck.js';
import DefaultBlockedWords from './blocked-words/default.js';

export const ClientConfigExample: IClientConfig = {
    owner_id: 'cupidjpeg',
    nickname: 'chuck',
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
        'waterkattv': ['water kat', 'the cat'],
        'fariaorion': ['faria'],
        'alexr118': ['alex'],
        'cupidjpeg': ['cupid'],
        'ssptaicho': ['thai cho']
    },
    tts: { voice: 'Matthew' },
    responses: {
        "chat-first-custom": {
            "fariaorion" : ["Hey look who it is, the eepy star demon cat!"]
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
