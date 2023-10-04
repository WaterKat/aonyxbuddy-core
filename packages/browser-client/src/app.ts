//import * as StreamCharacters from '@aonyxbuddy/stream-characters';
//import * as Tools from '@aonyxbuddy/tools';

import * as SpriteRendering from '@aonyxbuddy/sprite-rendering';
import * as StreamEvents from '@aonyxbuddy/stream-events';
import * as TextToSpeech from '@aonyxbuddy/text-to-speech';
import * as StreamEventParser from '@aonyxbuddy/stream-event-parser';
import StreamElements from '@aonyxbuddy/stream-elements';

//import config from './config/config.js';
import { ClientConfigExample as config } from './config/iclient-config-fariaorion.test.js';
import log from './log.js';

let talkingFrame = 0;

//* Preparing Body Styling 
document.body.style.margin = '0 0';
document.body.style.padding = '0 0';

//* Text To Speech
const tts = TextToSpeech.default(config.tts)

//* Text To Speech Queue Logic
const speechQueue: { text: string, callback?: () => void }[] = [];
const timeBetweenSpeech = 0.25;
let isSpeakingQueue = false;


function AppendToSpeechQueue(text: string, callback?: () => void) {
	speechQueue.push({ text: text, callback: callback });
}
function InsertToSpeechQueue(text: string, callback?: () => void) {
	speechQueue.splice(0, 0, { text: text, callback: callback });
}

function StopSpeaking(): boolean {
	if (isSpeakingQueue) {
		tts.Stop();
		isSpeakingQueue = false;
		return true;
	}
	return false;
}

function SpeakInQueue() {
	if (isSpeakingQueue) return;
	isSpeakingQueue = true;

	function SpeakRequest() {
		if (!isSpeakingQueue) return;

		if (speechQueue.length < 1) {
			isSpeakingQueue = false;
			return;
		}

		const speechRequest = speechQueue.shift();
		if (!speechRequest) return;

		log('info', 'Speech Request:', speechRequest.text);

		const interval = setInterval(() => {
			const amplitude = Math.min(TextToSpeech.Audio.GetAudioBufferAmplitude(tts.analyzer), 0.99);
			talkingFrame = Math.floor(config.spriteRendering.sprites['talking'].length * amplitude)
		}, 1000 / 60);

		tts.Speak(speechRequest.text, () => {
			clearInterval(interval);
			talkingFrame = 0;
			if (speechRequest.callback) speechRequest.callback();
			SpeakRequest();
		});

	}

	setTimeout(SpeakRequest, 1000 * timeBetweenSpeech);
}

//* Speech Skipping 

let skipCount = 0;

function SkipSpeech(count?: number) {
	skipCount += count ?? 0;
	log('info', 'Skips Starting: ' + skipCount);

	if (skipCount < 1) return;

	if (StopSpeaking()) skipCount -= 1;

	while (skipCount > 0 && speechQueue.length > 0) {
		const skipped = speechQueue.pop();
		log('info', 'SkipSpeech ' + skipped?.text);
		skipCount -= 1;
	}

	log('info', 'Skips Left: ' + skipCount);
}

function SkipAllSpeech() {
	StopSpeaking();
	while (speechQueue.length > 0) {
		const skipped = speechQueue.pop();
		log('info', 'SkipAllSpeech ' + skipped?.text);
	}
}

//* Mute 
let isMuted = false;
let mutedFrame = 0;

function SetMuted() {
	isMuted = true;
	mutedFrame = 1;
	SkipAllSpeech();
}

function SetUnmuted() {
	isMuted = false;
	mutedFrame = 0;
}


//* StreamEventParser

function ParseEvent(streamEvent: StreamEvents.Types.StreamEvent) {
	const response = StreamEventParser.Parser.GetResponse(config.responses, streamEvent, 'voice');
	AppendToSpeechQueue(response)

	//* Special Condition for Subscription (Sub Messages)

	if (streamEvent.type === 'subscriber'){
		AppendToSpeechQueue(streamEvent.message?.text ?? '');
	}
}

function ParseOther(event: StreamEvents.Types.StreamEvent) {
	log('log', 'Other:', event);
}

const command_identifier = '!';
const command_group = 'frank';

function ParseCommand(event: StreamEvents.Types.StreamEvent) {
	if (event.type !== 'command') return;
	if (event.command_identifier !== command_identifier) return;
	if (event.command_group !== command_group) return;
	const command = event.command_request.toLocaleLowerCase();
	switch (command) {
		case 'debug':
			log('log', 'Muted:', isMuted);
			log('log', 'SkipCount:', skipCount);
			log('log', speechQueue);
			break;
		case 'say':
			log('info', 'say command called');
			InsertToSpeechQueue(event.command_args);
			break;
		case 'mute': 
			log('info', 'mute called');
			SetMuted();
			break;
		case 'unmute':
			log('info', 'unmute called');
			SetUnmuted();
			break;
		case 'skip':
			log('info', 'skip command called');
			if (event.command_args.trim().length < 1) {
				log('info', 'skip arg is empty, therefore using 1 as default');
				SkipSpeech(1);
			} else if (!isNaN(+event.command_args.trim())) {
				log('info', 'skip arg is number');
				SkipSpeech(Math.max(0, +event.command_args));
			} else if (event.command_args.trim() === 'all') {
				log('info', 'skip all command');
				SkipAllSpeech();
			} else if (event.command_args.trim() === 'clear') {
				log('info', 'skip clear command');
				skipCount = 0;
			}
			break;
	}
}

//Sprite Renderer
function Render(renderer: SpriteRendering.Types.IRenderer) {
	renderer.ClearCanvas();
	renderer.RenderSprite('base', 0);
	renderer.RenderSprite('mute', mutedFrame);
	renderer.RenderSprite('talking', Math.floor(talkingFrame), () => { Render(renderer); });
}

const renderer = SpriteRendering.default(config.spriteRendering).then(renderer => {
	if (renderer instanceof Error) throw (renderer);
	Render(renderer);
});

//Stream Events
function OnEventReceived(rawEvent: StreamEvents.Types.StreamEvent) {
	let streamEvent = rawEvent;
	streamEvent = StreamEvents.Manipulation.ParseCommand(streamEvent, true);
	streamEvent = StreamEvents.Manipulation.IgnoreCommandWithoutPermission(streamEvent, 'CommandPermission');
	streamEvent = StreamEvents.Manipulation.FilterBannedWords(streamEvent, config.blockedWords);
	streamEvent = StreamEvents.Manipulation.FilterEmojis(streamEvent, '');
	streamEvent = StreamEvents.Manipulation.IgnoreFromBlacklist(streamEvent, config.blacklist);
	streamEvent = StreamEvents.Manipulation.IgnoreFromBotlist(streamEvent, config.botlist);
	streamEvent = StreamEvents.Manipulation.ProcessNicknames(streamEvent, config.nicknames);
	streamEvent = StreamEvents.Manipulation.IgnoreWithCondition(streamEvent, !isMuted, 'MuteToggle');
	console.info('RawEvent:', streamEvent);
	if (streamEvent.type === 'other') {
		ParseOther(streamEvent);
	} else if (streamEvent.type === 'command') {
		ParseCommand(streamEvent);
	} else {
		ParseEvent(streamEvent);
	}

	//! Hacky but works
	SkipSpeech();
	
	SpeakInQueue();
}

StreamElements(OnEventReceived);

AppendToSpeechQueue('A-onyx Buddy is active.');
SpeakInQueue();

// * THIS IS FOR DEBUGGING PURPOSES
/*

function CreateDummyMessages(count: number) {
	for (let i = 0; i < count; i++) {
		AppendToSpeechQueue('This is a dummy message number ' + Math.random() * 1000);
	}
}

setInterval(() => {
	CreateDummyMessages(15);
	SkipSpeech();
}, 1000 * 15);

*/

//Temp


/*

async function GetEventClient(
  blockedText: string[],
  botBlacklist: string[],
  nicknames: StreamEvents.Clients.PostProcessors.Nickname.INicknamePostProcessorOptions
): Promise<StreamEvents.Clients.EventManager> {

  //TODO Implementstream event alternatives

  function OnEventReceived(StreamEvents)

  const client = new StreamEvents.Clients.EventManager();
  const streamElementsEventListener =
	new StreamEvents.Clients.StreamElementsEventListener();
  client.attachListener(streamElementsEventListener);

  //remove bad words
  const textFilterPostProcessor =
	StreamEvents.Clients.PostProcessors.TextFilterPostProcessor(
	  blockedText,
	  false,
	  "EEEE"
	);
  client.attachPostProcessor(textFilterPostProcessor);

  //convert chat messages into command event
  const commandPostProcessor =
	StreamEvents.Clients.PostProcessors.CommandPostProcessor();
  client.attachPostProcessor(commandPostProcessor);

  //blacklist chat messsages
  const blacklistPostProcessor =
	new StreamEvents.Clients.PostProcessors.BlackList.BlackListPostProcessor(
	  botBlacklist
	);
  client.attachPostProcessor(blacklistPostProcessor);

  //convert command say to custom event
  const commandSayPostProcessor =
	new StreamEvents.Clients.PostProcessors.CommandSay.CommandSayPostProcessor();
  client.attachPostProcessor(commandSayPostProcessor);

  //remove commands without permissions
  const permissionPostProcessor =
	new StreamEvents.Clients.PostProcessors.Permissions.SkipEventCommandPostProcessor();
  client.attachPostProcessor(permissionPostProcessor);

  //nicknames
  const nicknamePostProcessor =
	new StreamEvents.Clients.PostProcessors.Nickname.NicknamePostProcessor(
	  nicknames
	);
  client.attachPostProcessor(nicknamePostProcessor);

  //mute command post processor
  const muteCommandPostProcessor =
	new StreamEvents.Clients.PostProcessors.MuteCommandPostProcessor();
  client.attachPostProcessor(muteCommandPostProcessor);

  //skip command post processor
  const skipCommandPostProcessor =
	new StreamEvents.Clients.PostProcessors.SkipEventCommandPostProcessor();
  client.attachPostProcessor(skipCommandPostProcessor);

  //remove emojis
  const emojiFilterPostProcessor =
	StreamEvents.Clients.PostProcessors.EmojiPostProcessor();
  client.attachPostProcessor(emojiFilterPostProcessor);

  //raid timeout for messages and follows
  const raidIgnorePostProcessor =
	new StreamEvents.Clients.PostProcessors.RaidIgnorePostProcessor();
  client.attachPostProcessor(raidIgnorePostProcessor);

  //hybrid - wait for first chat message then send new custom first-message event.
  const firstMessagePostProcessor =
	new StreamEvents.Clients.PostProcessors.FirstEventPostProcessor();
  client.attachListener(firstMessagePostProcessor);
  client.attachPostProcessor(firstMessagePostProcessor);

  //hybrid - process subscriber event and send their message as seperate say event
  const subscriberPostProcessor =
	new StreamEvents.Clients.PostProcessors.Subscriber.SubscriberPostProcessor();
  client.attachListener(subscriberPostProcessor);
  client.attachPostProcessor(subscriberPostProcessor);

  return client;
}

async function GetCharacter(
  pngconfig: StreamCharacters.PNG.IPNGRendererOptions,
  ttsconfig: StreamCharacters.TextToSpeech.StreamElementsTTS.IStreamElementsTTSOptions
): Promise<StreamCharacters.StreamCharacters.StreamCharacter> {
  const renderer = await Tools.AsyncClassInitializer.create(
	StreamCharacters.PNG.PNGRenderer,
	pngconfig
  );

  if (!renderer) throw renderer;

  const tts =
	new StreamCharacters.TextToSpeech.StreamElementsTTS.StreamElementsTTS(
	  ttsconfig
	);

  const streamCharacterOptions: StreamCharacters.StreamCharacters.IStreamCharacterOptions =
  {
	renderer: renderer,
	tts: tts,
  };

  const character = await Tools.AsyncClassInitializer.create(
	StreamCharacters.StreamCharacters.StreamCharacter,
	streamCharacterOptions
  );

  if (!character) throw character;

  return character;
}

async function main() {
  const helloWorldMessage = `My name is ${config.name}. Glad to meet you, ${config.id}!`;

  const character = await GetCharacter(
	config.png,
	config.tts
  );

  const eventClient = await GetEventClient(
	config.badWords,
	config.botlist,
	config.nicknames
  );

  eventClient.eventSubscription.subscribe((event) => {
	log('info', event);
  });

  if (!character || !eventClient) {
	console.error(character, eventClient);
	throw "error on init";
  }

  log('info', "Frank client-browser has been initiated");
  await character.Speak(helloWorldMessage);

  const eventParserOptions = config.responses;
  const eventParser = new StreamEvents.Parsers.StreamEventParser(
	eventParserOptions
  );

  const standardEventList: StreamEvents.StreamEvent[] = [];
  let listPlaying = false;

  eventClient.eventSubscription.subscribe(ProcessEvent);

  function ProcessEvent(event: StreamEvents.StreamEvent) {
	if (event.type === "command") {
	  if (event.command_identifier === "!" && event.command_group === "frank") {
		if (event.command_request === "skip") {
		  log('info', "skip requested");
		  character.Interrupt();
		}
	  }
	} else if (event.type !== "ignore") {
	  standardEventList.push(event);
	  if (!listPlaying) PlayEventList();
	}
  }

  async function PlayEventList() {
	listPlaying = true;

	while (standardEventList.length > 0) {
	  const currentEvent = standardEventList.shift();
	  if (!currentEvent) break;

	  const response = eventParser.GetVoiceResponse(currentEvent);
	  await character.Speak(response);
	}

	listPlaying = false;
  }
}

main();
*/