/// <reference lib="dom" />

import * as SpriteRendering from './sprite-rendering/index.js';
import * as StreamEvents from './stream-events/index.js';
import * as TextToSpeech from './text-to-speech/index.js';
import * as StreamEventParser from './stream-event-parser/index.js';
import StreamElements from './stream-elements/index.js';

//import { ClientConfigExample as config } from './config/iclient-config-cupidjpeg.test.js';
//import { ClientConfigExample as config } from './config/iclient-config-waterkattv.test.js';
//import { ClientConfigExample as config } from './config/iclient-config-fariaorion.test.js';
import { config } from './config/config.ts';

import Log from './log.js';
import GetAonyxBuddyStreamEventListener from './stream-event-listener/index.js';


//* Preparing Body Styling 
document.body.style.margin = '0 0';
document.body.style.padding = '0 0';

//* Text To Speech
const tts = TextToSpeech.default(config.texttospeech)

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

		Log('info', 'Speech Request:', speechRequest.text);

		const interval = setInterval(() => {
			const amplitude = Math.min(TextToSpeech.Audio.GetAudioBufferAmplitude(tts.analyzer), 0.99);
			talkingFrame = Math.floor(config.rendering.spriteRendering.sprites['talking'].length * amplitude)
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
	Log('info', 'Skips Starting: ' + skipCount);

	if (skipCount < 1) return;

	if (StopSpeaking()) skipCount -= 1;

	while (skipCount > 0 && speechQueue.length > 0) {
		const skipped = speechQueue.pop();
		Log('info', 'SkipSpeech ' + skipped?.text);
		skipCount -= 1;
	}

	Log('info', 'Skips Left: ' + skipCount);
}

function SkipAllSpeech() {
	StopSpeaking();
	while (speechQueue.length > 0) {
		const skipped = speechQueue.pop();
		Log('info', 'SkipAllSpeech ' + skipped?.text);
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

	if ((streamEvent.type === StreamEvents.Types.StreamEventType.SUBSCRIBER) || (streamEvent.type === StreamEvents.Types.StreamEventType.CHEER)) {
		AppendToSpeechQueue(streamEvent.message?.text ?? '');
	}
}

function ParseOther(otherEvent: StreamEvents.Types.StreamEvent) {
	if (otherEvent.type !== 'other') {
		Log('info', 'ParseOther: Event not "other" type');
		return;
	}

	if (!otherEvent.other) {
		Log('info', 'ParseOther: event "other" field not set');
		return;
	}

	if (!otherEvent.other.type) {
		Log('info', 'ParseOther: "type" field not set');
		return;
	}

	if (otherEvent.other.type === 'chat-first' && otherEvent.original.type === 'chat') {
		const customChatFirstResponse = StreamEventParser.Parser.GetResponse(config.responses, otherEvent.original, 'chat-first-custom', otherEvent.username);
		const generalChatFirstResponse = StreamEventParser.Parser.GetResponse(config.responses, otherEvent.original, 'voice', 'chat-first');
		AppendToSpeechQueue(customChatFirstResponse.length > 0 ? customChatFirstResponse : generalChatFirstResponse);
		SpeakInQueue();
		Log('info', generalChatFirstResponse);
	} else {
		Log('info', 'ParseOther: "type" is not chat-first');
	}

	Log('error', otherEvent);
}


const command_prefixes = config.commands.prefixes;

function ParseCommand(event: StreamEvents.Types.StreamEvent) {
	if (event.type !== 'command') return;
	if (event.command_identifier !== command_prefixes) return;
	if (event.command_group !== command_actions && event.command_group !== 'aonyxbuddy') return;
	const command = event.command_request.toLocaleLowerCase();
	switch (command) {
		case 'debug':
			Log('log', 'Muted:', isMuted);
			Log('log', 'SkipCount:', skipCount);
			Log('log', speechQueue);
			break;
		case 'say':
			Log('info', 'say command called');
			InsertToSpeechQueue(event.command_args);
			break;
		case 'mute':
			Log('info', 'mute called');
			SetMuted();
			break;
		case 'unmute':
			Log('info', 'unmute called');
			SetUnmuted();
			break;
		case 'skip':
			Log('info', 'skip command called');
			if (event.command_args.trim().length < 1) {
				Log('info', 'skip arg is empty, therefore using 1 as default');
				SkipSpeech(1);
			} else if (!isNaN(+event.command_args.trim())) {
				Log('info', 'skip arg is number');
				SkipSpeech(Math.max(0, +event.command_args));
			} else if (event.command_args.trim() === 'all') {
				Log('info', 'skip all command');
				SkipAllSpeech();
			} else if (event.command_args.trim() === 'clear') {
				Log('info', 'skip clear command');
				skipCount = 0;
			}
			break;
	}
}

//Sprite Renderer
let talkingFrame = 0;
let idleFrame = 0;

function Render(renderer: SpriteRendering.Types.IRenderer) {
	renderer.ClearCanvas();
	renderer.RenderSprite('base', idleFrame);
	renderer.RenderSprite('mute', mutedFrame);
	renderer.RenderSprite('talking', Math.floor(talkingFrame), () => { Render(renderer); });
}

function FlipBaseImage(renderer: SpriteRendering.Types.IRenderer) {
	idleFrame++;
	idleFrame %= renderer.sprites['base'].bitmap.length;
	setTimeout(() => {
		FlipBaseImage(renderer);
	}, renderer.sprites['base'].delay[idleFrame]);
}

const renderer = SpriteRendering.default(config.rendering.spriteRendering).then(renderer => {
	if (renderer instanceof Error) throw (renderer);
	Render(renderer);
	if (renderer.sprites['base'].bitmap.length > 0)
		FlipBaseImage(renderer);
});

//Stream Events
function OnEventReceived(rawEvent: StreamEvents.Types.StreamEvent) {
	let streamEvent = rawEvent;
	streamEvent = StreamEvents.Manipulation.FilterBannedWords(streamEvent, config..blockedWords, 'ploop', false);
	streamEvent = StreamEvents.Manipulation.ParseCommand(streamEvent, true);
	streamEvent = StreamEvents.Manipulation.IgnoreCommandWithoutPermission(streamEvent, 'CommandPermission');
	streamEvent = StreamEvents.Manipulation.FilterEmojis(streamEvent, '');
	streamEvent = StreamEvents.Manipulation.FilterCheers(streamEvent, ' ');
	streamEvent = StreamEvents.Manipulation.IgnoreFromBlacklist(streamEvent, config.users.blacklist);
	streamEvent = StreamEvents.Manipulation.IgnoreFromBotlist(streamEvent, config.users.botlist);
	streamEvent = StreamEvents.Manipulation.ProcessNicknames(streamEvent, config.users.nicknames);
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

	SkipSpeech();

	SpeakInQueue();
}

StreamElements(OnEventReceived);
GetAonyxBuddyStreamEventListener(OnEventReceived);

AppendToSpeechQueue(`'A-onyx Buddy systems online. ${config.instance_nickname}, is active.'`);
SpeakInQueue();
