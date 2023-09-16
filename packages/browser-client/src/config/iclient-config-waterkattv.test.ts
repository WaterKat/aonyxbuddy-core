import { IClientConfig } from './iclient-config.js';
//import { StreamEvents } from '../external';

export const ClientConfigExample: IClientConfig = {
    id: 'waterkattv',
    name: 'aonyxbuddy',
    botBlacklist: [
        'nightbot',
        'streamelements',
        'soundalerts',
        'streamlabs',
        'botterkat',
        'kofistreambot',
    ],
    badWords: [
        "dyke",
        "fag",
        "fag1t",
        "faget",
        "fagg1t",
        "faggit",
        "faggot",
        "fagg0t",
        "fagit",
        "fags",
        "fagz",
        "faig",
        "faigs",
        "femboy",
        "Fudge Packer",
        "gook",
        "g00k",
        "jap ",
        "japs",
        "Lezzian",
        "Lipshits",
        "Lipshitz",
        "n1gr",
        "nastt",
        "nigger",
        "nigur",
        "niiger",
        "niigr",
        "polac",
        "polack",
        "polak",
        "Poonani",
        "qweir",
        "retard",
        "chink",
        "nazi",
        "nigga",
        "nigger",
        "shemale",
        "w00se",
        "amcik",
        "andskota",
        "ayir",
        "butt-pirate",
        "cazzo",
        "chraa",
        "chuj",
        "daygo",
        "dego",
        "dike",
        "dupa",
        "dziwka",
        "Ekrem",
        "Ekto",
        "enculer",
        "faen",
        "fag",
        "fanculo",
        "fanny",
        "feg",
        "Flikker",
        "gook",
        "honkey",
        "hui",
        "injun",
        "kanker",
        "kike",
        "klootzak",
        "kraut",
        "knulle",
        "kuk",
        "kuksuger",
        "Kurac",
        "kurwa",
        "kusi",
        "kyrpa",
        "lesbo",
        "mamhoon",
        "mibun",
        "monkleigh",
        "mouliewop",
        "muie",
        "mulkku",
        "muschi",
        "nazis",
        "nepesaurio",
        "nigger",
        "orospu",
        "paska",
        "perse",
        "picka",
        "pierdol",
        "pillu",
        "pimmel",
        "pizda",
        "poontsee",
        "pula",
        "pule",
        "rautenberg",
        "schaffer",
        "scheiss",
        "schlampe",
        "sharmuta",
        "sharmute",
        "shipal",
        "shiz",
        "skribz",
        "skurwysyn",
        "sphencter",
        "spic",
        "spierdalaj",
        "suka",
        "vittu",
        "wetback",
        "wichser",
        "wop",
        "yed",
        "zabourah"
    ],
    png: {
        config: {
            size: {
                x: 256,
                y: 256
            },
            smoothed: false,
            defaultFPS: 5,
            sprites: {
                idle : [
                    'https://resources.aonyxlimited.com/cat-sprites/idle_1/0.png',
                    'https://resources.aonyxlimited.com/cat-sprites/idle_1/1.png',
                    'https://resources.aonyxlimited.com/cat-sprites/idle_1/2.png',
                    'https://resources.aonyxlimited.com/cat-sprites/idle_1/3.png',
                ], 
                idle_2 : [
                    'https://resources.aonyxlimited.com/cat-sprites/idle_2/0.png',
                    'https://resources.aonyxlimited.com/cat-sprites/idle_2/1.png',
                    'https://resources.aonyxlimited.com/cat-sprites/idle_2/2.png',
                    'https://resources.aonyxlimited.com/cat-sprites/idle_2/3.png',
                ], 
                idle_3 : [
                    'https://resources.aonyxlimited.com/cat-sprites/idle_3/0.png',
                    'https://resources.aonyxlimited.com/cat-sprites/idle_3/1.png',
                    'https://resources.aonyxlimited.com/cat-sprites/idle_3/2.png',
                    'https://resources.aonyxlimited.com/cat-sprites/idle_3/3.png',
                ], 
                idle_4 : [
                    'https://resources.aonyxlimited.com/cat-sprites/idle_4/0.png',
                    'https://resources.aonyxlimited.com/cat-sprites/idle_4/1.png',
                    'https://resources.aonyxlimited.com/cat-sprites/idle_4/2.png',
                    'https://resources.aonyxlimited.com/cat-sprites/idle_4/3.png',
                ], 
                talking : [
                    'https://resources.aonyxlimited.com/cat-sprites/talk/0.png',
                    'https://resources.aonyxlimited.com/cat-sprites/talk/1.png',
                    'https://resources.aonyxlimited.com/cat-sprites/talk/2.png',
                    'https://resources.aonyxlimited.com/cat-sprites/talk/3.png',
                    'https://resources.aonyxlimited.com/cat-sprites/talk/4.png'
                ],
                
                /*
                idle: ['https://resources.aonyxlimited.com/frank/0.png'],
                talking: [
                    'https://resources.aonyxlimited.com/frank/0.png',
                    'https://resources.aonyxlimited.com/frank/1.png',
                    'https://resources.aonyxlimited.com/frank/2.png',
                    'https://resources.aonyxlimited.com/frank/3.png',
                    'https://resources.aonyxlimited.com/frank/4.png',
                    'https://resources.aonyxlimited.com/frank/5.png',
                    'https://resources.aonyxlimited.com/frank/6.png',
                    'https://resources.aonyxlimited.com/frank/7.png',
                    'https://resources.aonyxlimited.com/frank/8.png',
                    'https://resources.aonyxlimited.com/frank/9.png',
                    'https://resources.aonyxlimited.com/frank/10.png'
                ],
                */
            },
            transitions: {
                /*
                idle: [['talking', undefined, 0]],
                talking: [['idle', undefined, 0]],
                */
                idle: [
                    ['idle', undefined, 20],
                    ['idle*', undefined, 1],
                    ['talking', undefined, 0]
                ],
                idle_2 : [
                    ['idle*', undefined, 1],
                    ['talking', undefined, 0]
                ],
                idle_3 : [
                    ['idle*', undefined, 1],
                    ['talking', undefined, 0]
                ],
                idle_4 : [
                    ['idle*', undefined, 1],
                    ['talking', undefined, 0]
                ],
                talking: [
                    ['idle*', undefined, 0]
                ]
            },
        }
    },
    nicknames: {
        'waterkattv': ['papa', 'waterkat', 'the cat', 'the gremlin in the corner of the room'],
        'fariaorion': ['deez', 'onion', 'faria', 'foreo mik flurry', 'faris', 'foreo', 'froggia', 'fawi', 'fori', 'fawwia', 'ferrari'],
        'alexr118': ['alex'],
        'tundraflame': ['tundra'],
        'w01f_k': ['woof woof', 'bark bark', 'wolf', 'wolf owo'],
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
        'bluebekaw': ['blue bekaw', 'bekaw', 'poot'],
        'fenrirdesigns': ['fenrir'],
        'cupidjpeg' : ['cupid', 'cutie', 'sexy beast']
    },
    tts: { voice: 'Joey'},
    responses: {
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
        }
    }
}
