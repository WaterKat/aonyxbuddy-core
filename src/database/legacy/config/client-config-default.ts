import { IClientConfig } from '../iclient-config.js';
import { IAonyxBuddyInstance } from '../../config-types.js';
//import * as StreamCharacters from '@aonyxbuddy/stream-characters';
import * as StreamEvents from '@aonyxbuddy/stream-events';
import FrankBase64Sprites from './base64-sprites/frank.js';

export const DefaultAonyxBuddyConfiguration: IAonyxBuddyInstance = {
    instance_nickname: "ai",
    rendering: {
        "spriteRendering": {
            "canvas": {
                "size": {
                    "x": 256,
                    "y": 256
                },
                "antialiasing": false
            },
            "defaultFPS": 24,
            "sprites": {
                "base": ["https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/base.png"],
                "talking": [
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
                    "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/talking/10.png"                  
                ],
                "mute": [
                    "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/empty.png",
                    "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/ai/mute.png"
                ]
            }
        }
    },
    texttospeech: {
        "voice": "Emma"
    },
    users: {
        "nicknames": {
            "aonyxbuddy": [
                "buddy"
            ]
        },
        "botlist": [
            "nightbot",
            "streamelements",
            "soundalerts",
            "streamlabs",
            "kofistreambot",
            "aonyxbuddy"
        ],
    },
    responses: {
        "Welcome in! ${nickname}.": [
            "follow",
            "chat-first"
        ],
        "Thank you for the follow! ${nickname}.": [
            "follow"
        ],
        "Thank you for the subscription! ${nickname}": [
            "subscription"
        ],
        "Any support is appreciated ${nickname}! Thank you so much!": [
            "subscription",
            "cheer"
        ]
    },
    commands: {
        "prefixes": [
            "~",
            "!example"
        ],
        "actions": [
            "say@~,speak,read",
            "mute",
            "unmute",
            "skip"
        ]
    },
    security: {
        "blacklist": [],
        "blockedWords": [],
    },
    created_at: '2024-01-14 02:49:11.534649+00'
}
