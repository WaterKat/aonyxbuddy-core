# AonyxBuddy

## AonyxLimited
### By WaterKat

AonyxBuddy is a plugin for StreamElements that takes user-generated responses to events in a stream. It allows users to interact with their Twitch channels in new ways, as well as serve as a management tool for new streamers.

## Features

- AonyxBuddy will respond to Twitch events with provided responses:
  - New Follows
  - New Subscribers
  - Gifted Subs
  - Cheer Events
  - Raid Events
  - First Chat of the Stream (Welcome)
- AonyxBuddy can also be interacted with commands:
  - AonyxBuddy will respond to its given name or "aonyxbuddy".
  - For example, `!aonyxbuddy say hello world!` can be used as well as `!sol say hello world!` if "sol" has been assigned as its name.
  - Commands:
    - "say": will speak the text following the command.
        - it is possible to assign aliases in the configuration, allowing commands such as ```!!: hello world!```
        to work properly as an alias for ```!aonyxbuddy say hello world!```
    - "skip" followed by "$args": will have different behaviors:
      - none (no arguments): will cut off the current spoken message, or if none is being spoken, will skip the next incoming speech event.
      - number (a valid integer above 0): will cut off the current spoken message and will add the skip count.
      - "all": will cut off the current spoken message and will skip all queued messages.

## Getting Started
Dependencies 
    - Bun 1.1.3

The following would be placed within the JS field of a custom stream elements widget.

a configuration must be provided of type IClientConfig within ```src/config/iclient-config.ts```
```
const AonyxBuddyConfig = {
    owner_id: 'aonyxbuddy',
    nickname: 'sol',
    blacklist: [],
    botlist: [
        'nightbot',
        'streamelements',
        'soundalerts',
        'streamlabs',
        'kofistreambot',
    ],
    blockedWords: ["your", "bad", "words", "here"],
    spriteRendering: {
        canvas: {
            size: {
                x: 256,
                y: 256
            },
            antialiasing: true
        },
        defaultFPS: 24,
        sprites: {
            base: "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/idle.gif",
            talking: [
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/0.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/1.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/2.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/3.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/4.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/5.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/6.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/7.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/8.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/9.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/10.png",
                "https://www.aonyxlimited.com/resources/aonyxbuddy/sprites/sol/talking/11.png"
            ]
        }
    },
    nicknames: {
        'aonyxbuddy': ['a nickname goes here'],
    },
    tts: { voice: 'Brian' },
    responses: {
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
            cheer: ["Thank you for the cheer! ${nickname}"],
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
            ],
        }
    }
}
```

as well as the contents of the app.js file build by bun with 
```bun run build```

---

&copy; 2024 AonyxLimited. All rights reserved.
