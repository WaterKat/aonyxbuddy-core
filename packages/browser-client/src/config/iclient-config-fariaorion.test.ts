import { IClientConfig } from './iclient-config.js';
import FrankBase64Sprites from './base64-sprites/frank.js';
import DefaultBlockedWords from './blocked-words/default.js';

export const ClientConfigExample: IClientConfig = {
    id: 'fariaorion',
    name: 'frank',
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
        sprites: FrankBase64Sprites
    },
    nicknames: {
        'waterkattv': ['papa', 'waterkat', 'the cat'],
        'fariaorion': ['deez', 'onion', 'faria', 'foreo mik flurry', 'faris', 'foreo', 'froggia', 'fawi', 'fori', 'fawwia', 'ferrari'],
        'alexr118': ['alex'],
        'tundraflame': ['tundra'],
        'w01f_k': ['woof woof', 'bark bark', 'wolf', 'wolf owo', 'cheater'],
        'squishylope': ['squishy'],
        'theherooftime69': ['the hero of time sixty nine', 'the roof of time', 'roof', 'hero'],
        'fawia_support_raccoon': ['racc', 'rack attack', 'cutie rack'],
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
    tts: { voice: 'Brian' },
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
                "Thanks for following, ${nickname}! Enjoy the cosmic journey!",
                "Welcome, ${nickname}! Let's explore the universe together!",
                "Appreciate the follow, ${nickname}! Your support means the world!",
                "Glad to have you as a follower, ${nickname}! May your galactic journey be amazing!",
                "Welcome to the Orion constellation, ${nickname}! Get ready for an out-of-this-world experience!",
                "Hey there, ${nickname}! Join our interplanetary gaming adventure!",
                "Welcome to the Orion constellation, ${nickname}! Let's conquer galaxies together!",
                "Thanks for joining our celestial realm, ${nickname}! Get ready for cosmic gameplay!",
                "Step into the cosmic portal, ${nickname}! Let's explore virtual galaxies!",
                "Thank you for joining our cosmic caravan, ${nickname}! Let's traverse the universe!",
                "Calling all star beans! ${nickname} has followed. Get ready for an epic gaming odyssey!",
                "Prepare for a cosmic odyssey, ${nickname}! Explore the universe in games!"
            ],
            subscriber: [
                "Thanks ${nickname} for ${subscriber.length} stellar month${subscriber.plural} of support!",
                "Celestial cheers, ${nickname}! Join us for ${subscriber.length} month${subscriber.plural} of cosmic exploration!",
                "Shoutout to ${nickname}! ${subscriber.length} month${subscriber.plural} in our Orion Constellation! Your subscription powers our cosmic journey.",
                "Appreciate your subscription, ${nickname}! ${subscriber.length} month${subscriber.plural} of cosmic commitment!",
                "Welcome, ${nickname}! Explore the cosmos with us for ${subscriber.length} month${subscriber.plural}!",
                "Cosmic gratitude, ${nickname}! ${subscriber.length} stellar month${subscriber.plural} of support!",
                "Celestial greetings, ${nickname}! A ${subscriber.length}-month subscription shining like a supernova.",
                "Stellar salute, ${nickname}! ${subscriber.length} month${subscriber.plural} of loyal star bean support!",
                "Celestial blessings, ${nickname}! Keep the cosmic energy flowing with your ${subscriber.length}-month subscription.",
                "Thanks ${nickname} for the ${subscriber.length}-month cosmic subscription! Your commitment fuels us.",
                "Welcome back, ${nickname}! ${subscriber.length}-month subscription adding celestial sparkles!",
                "Thanks ${nickname} for ${subscriber.length} stellar month${subscriber.plural}! Your support ignites us.",
                "Celestial applause, ${nickname}! ${subscriber.length}-month subscription guiding us.",
                "Thanks ${nickname} for the ${subscriber.length}-month interstellar subscription! Your support fuels us.",
                "Celestial waves to ${nickname}! ${subscriber.length} month${subscriber.plural} as a star bean in the Orion constellation!",
                "Cosmic shoutout, ${nickname}! ${subscriber.length}-month subscription lighting up our stream.",
                "Thanks ${nickname} for being a stellar star bean! ${subscriber.length} month${subscriber.plural} of support!",
                "Celestial high fives, ${nickname}! ${subscriber.length}-month subscription fueling our cosmic adventures!",
            ],
            "gift-single": [
                "Stellar shoutout to ${nickname} for the generous gift! Welcome, ${gift.receiver}! Enjoy the cosmic journey!",
                "Celestial cheers to ${nickname} for the amazing gift! ${gift.receiver}, join the starbeans for an incredible experience!",
                "Thank you, ${nickname}, for the interstellar gift! Welcome to the cosmic family, ${gift.receiver}!",
                "Celestial gratitude to ${nickname} for the generous gift! Welcome aboard, ${gift.receiver}! Your cosmic journey begins!",
                "Thank you, ${nickname}, for the stellar gift! Join our celestial journey, ${gift.receiver}!",
                "Celestial shoutout to ${nickname} for the amazing gift! Welcome to the star beans, ${gift.receiver}!",
                "Celestial applause to ${nickname} for the incredible gift! Welcome to the Orion constellation, ${gift.receiver}!",
                "Cosmic salute to ${nickname} for the generous gift! Enjoy interplanetary gaming, ${gift.receiver}!",
                "Thank you, ${nickname}, for the interstellar gift! Explore the vast reaches of space, ${gift.receiver}!",
                "Stellar shoutout to ${nickname} for the amazing gift! Brighten our cosmic stream, ${gift.receiver}!",
                "Thank you, ${nickname}, for the cosmic gift! Launch us to new gaming heights, ${gift.receiver}!",
                "Thank you, ${nickname} for the stellar gift! Ignite the cosmic fire, ${gift.receiver}!",
                "Celestial cheers to ${nickname} for the amazing gift! Light up our stream, ${gift.receiver}!",
                "Thank you, ${nickname}, for the cosmic gift! Your loyalty fuels us, ${gift.receiver}!",
                "Stellar shoutout to ${nickname} for the incredible gift! Fuel our cosmic adventures, ${gift.receiver}!",
                "Celestial gratitude to ${nickname} for the generous gift! Set the course for intergalactic voyage, ${gift.receiver}!",
            ],
            "gift-bulk-sent": [
                "Cosmic shoutout to ${nickname} for an epic star bean supernova of ${gift.count} subscriptions, igniting our stream with celestial fire!",
                "Incoming star bean supernova! Massive thanks to ${nickname} for gifting ${gift.count} subscriptions, creating a cosmic explosion of excitement!",
                "Hold on tight, star beans! We've encountered a supernova! Thanks to ${nickname} for igniting ${gift.count} subscriptions!",
                "Alert! Witnessed a star bean supernova! Thanks ${nickname} for fueling our stream with ${gift.count} subscriptions!",
                "Thrilled to welcome new star beans to the Orion Constellation! Thanks ${nickname} for bringing ${gift.count} subscriptions!",
                "Stellar shoutout to ${nickname} for a star bean supernova of ${gift.count}, illuminating our stream with cosmic power!",
                "Hold on tight! Prepare for a star bean supernova! Enormous thanks to ${nickname} for gifting ${gift.count} subscriptions!",
                "Honored to have you as part of our supernova-powered community, ${nickname}! Welcome ${gift.count} new star beans to an intergalactic thrill ride!",
            ],
            "gift-bulk-received": [],
            raid: [
                "Meteor shower alert! ${nickname} is bringing ${raid.count} raider${raid.plural} for a cosmic adventure!",
                "Incoming meteor shower! Thanks ${nickname} for bringing ${raid.count} raider${raid.plural}!",
                "Cosmic raiders on the radar! Welcome ${nickname} and your community of ${raid.count}!",
                "Brace for impact! ${nickname} brings ${raid.count} raider${raid.plural} to storm our cosmic sanctuary!",
                "Cosmic raid unleashed! Thanks ${nickname} for bringing your community of ${raid.count}!",
                "Welcome raiders! ${nickname} brings ${raid.count} raider${raid.plural} like a meteor shower!",
                "Incoming meteor shower! Thanks ${nickname} for bringing ${raid.count} raider${raid.plural}!",
                "Attention star beans! ${nickname} and ${raid.count} raider${raid.plural} are incoming!"
            ],
            cheer: [],
            chat: [],
            command: [],
            redeem: [],
            "chat-first": [
                "Welcome, ${nickname}! Enjoy the cosmic vibes!",
                "Greetings, ${nickname}! Thanks for joining us!",
                "Hello there, ${nickname}! It's great to see you in the chat!",
                "Hey, ${nickname}! The cosmic adventure begins now. Buckle up!",
                "Greetings, ${nickname}! Your presence makes the stream shine brighter!",
                "Welcome, ${nickname}! Your arrival brings a new spark to the cosmic journey!",
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
