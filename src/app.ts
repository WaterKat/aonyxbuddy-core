/// <reference lib="dom" />

import * as SpriteRendering from '@aonyxbuddy/sprite-rendering';
import * as StreamEvents from '@aonyxbuddy/stream-events';
import * as TextToSpeech from '@aonyxbuddy/text-to-speech';
import * as StreamEventParser from '@aonyxbuddy/stream-event-parser';
import StreamElements from '@aonyxbuddy/stream-elements';
import { GetWebSocketWrapper } from './external/al-aonyxbuddy-client.js';
import { ClientConfigExample as config } from './config/iclient-config-waterkattv.test.js';

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

	if (streamEvent.type === 'subscriber') {
		AppendToSpeechQueue(streamEvent.message?.text ?? '');
	}
}

function ParseOther(otherEvent: StreamEvents.Types.StreamEvent) {
	if (otherEvent.type !== 'other') {
		log('info', 'ParseOther: Event not "other" type');
		return;
	}

	if (!otherEvent.other) {
		log('info', 'ParseOther: event "other" field not set');
		return;
	}

	if (!otherEvent.other.type) {
		log('info', 'ParseOther: "type" field not set');
		return;
	}

	if (otherEvent.other.type === 'chat-first' && otherEvent.original.type === 'chat') {
		const customResponse = StreamEventParser.Parser.GetResponse(config.responses, otherEvent.original, 'voice', 'chat-first');
		AppendToSpeechQueue(customResponse);
		SpeakInQueue();
		log('info', customResponse);
	} else {
		log('info', 'ParseOther: "type" is not chat-first');
	}

	log('error', otherEvent);
}


const command_identifier = config.commandIdentifier ?? '!';
const command_group = config.commandGroup ?? 'aonyxbuddy';

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
	streamEvent = StreamEvents.Detection.DetectFirstEvent(streamEvent, ParseOther);
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

const websocketURL = `wss://www.aonyxlimited.com/api/v1/ws`;
GetWebSocketWrapper(websocketURL, OnEventReceived, {
	logging: true,
	token: config.webSocketToken ?? ''
});
//WebSocketStreamEvents(websocketURL, OnEventReceived, true);

AppendToSpeechQueue(`'A-onyx Buddy also known as ${config.name}, is active.'`);
SpeakInQueue();
