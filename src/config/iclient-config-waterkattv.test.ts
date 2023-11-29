import { IClientConfig } from './iclient-config.js';
import FrankBase64Sprites from './base64-sprites/frank.js';
import DefaultBlockedWords from './blocked-words/default.js';

export const ClientConfigExample: IClientConfig = {
    id: 'waterkat',
    name: 'ai',
    webSocketToken: 'urPO9OMZYRhQPwNTHZ4RcA',
    commandIdentifier: '!',
    commandGroup: 'ai',
    blacklist: [],
    botlist: [
        'nightbot',
        'streamelements',
        'soundalerts',
        'streamlabs',
        'botterkat',
        'kofistreambot',
    ],
    blockedWords: DefaultBlockedWords,
    spriteRendering: {
        canvas: {
            size: {
                x: 256,
                y: 256
            },
            antialiasing: false
        },
        defaultFPS: 60,
        sprites: {
            base: ["https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/base.png"],
            talking: [
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/0.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/1.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/2.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/3.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/4.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/5.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/6.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/7.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/8.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/9.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/10.png",
            ],
            mute: [
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/empty.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/mute.png"
            ]
        }
    },
    nicknames: {
        'waterkattv': ['papa', 'waterkat', 'the cat', 'streemer'],
        'fariaorion': ['onion', 'faria', 'foreo mik flurry', 'faris', 'foreo', 'froggia', 'fawi', 'fori', 'fawwia', 'ferrari'],
        'alexr118': ['alex'],
        'tundraflame': ['tundra'],
        'w01f_k': ['woof woof', 'bark bark', 'wolf', 'wolf owo', 'cheater', 'wolfie', 'wahf wahf'],
        'squishylope': ['squishy'],
        'theherooftime69': ['the hero of time sixty nine', 'the roof of time', 'roof', 'hero'],
        'fawia_support_raccoon': ['racc', 'rack attack'],
        'rukiaddict': ['rukia'],
        'TheDaddyCakes': ['Daddy Cakes', 'daddy'],
        'palerider_pr80': ['pale', 'paw lay', 'pel'],
        'kibatk': ['kiba', 'key bah'],
        'ursidaecrow': ['ursiday'],
        'vtuber_malcolm': ['malcom', 'vtuber malcolm'],
        'amethystcrownx': ['amethyst'],
        'carlos90975': ['carlos', 'kiss a homie'],
        'bluebekaw': ['blue bekaw', 'bekaw'],
        'fenrirdesigns': ['fenrir'],
        'cupidjpeg': ['cupid', 'cutie', 'sexy beast']
    },
    tts: { voice: 'Emma' },
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
                "Thanks for following, ${nickname}! Lets build a community together!",
                "Welcome, ${nickname}! Thank you for the follow",
                "Hey ${nickname}! Your support means a lot!",
                "Welcome in ${nickname}. Grab a seat!",
                "${nickname}, welcome in. Join us in our digital trek.",
                "Hello World! Welcome in ${nickname}",
                "New connection detected, hello ${nickname}!"
            ],
            subscriber: [
                "It means so much for you to subscribe ${nickname}. Let's develop a greater community together!",
                "${subscriber.length} month${subscriber.plural} of support! Thank you so much ${nickname} it means so much! heart",
                "Hello chat! ${nickname} has subscribed for ${subscriber.length} month${subscriber.plural}. Thank you for your commitment.",
                "Secure connection established! Thank you for your subscription ${nickname}! Your content should be delivered shortly, smile!",
                "PING . . . PONG! Thank you for your month${subscriber.plural} subscription ${nickname}. Your support will keep us journeying through cyberspace!"
            ],
            "gift-single": ['Thank you for gifting a subscription, ${nickname}. ${gift.receiver} enjoy your stay.'],
            "gift-bulk-sent": ['Thank you for gifting ${gift.count} subscriptions ${nickname}.'],
            "gift-bulk-received": [],
            raid: [
                "Incoming DDOS? No! its ${nickname} bringing ${raid.count} raider${raid.plural}. Welcome!",
                "SELECT FROM ${nickname} JOIN waterkat. Join us ${raid.count} raider${raid.plural}. Welcome in!",
                "New network detected! Establishing connection with ${nickname}, and their ${raid.count} raider${raid.plural}!",
                "Incoming stream! Parsing ${raid.count} new connection${raid.plural}. Thank you for joining ${nickname}!",
                "${raid.count} new viewer${raid.plural} detected. Thank your ${nickname} for bringing your community!"
            ],
            cheer: [],
            chat: [],
            command: [],
            redeem: [],
            "chat-first": [
                "Client connected, hello ${nickname}!",
                "Beep boop, Hi ${nickname}!",
                "Hello! Take a seat ${nickname}!",
                "Thanks for joining us ${nickname}!",
                "Hello world! says ${nickname}",
                "${nickname}, welcome in",
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