/// <reference lib="dom" />

import * as SpriteRendering from './sprite-rendering/index.js';
import { IRendererParam } from './sprite-rendering/types.js';

import * as TextToSpeech from './text-to-speech/index.js';
import * as StreamEventParser from './stream-event-parser/index.js';
import StreamElements from './stream-elements/index.js';

import Log from './log.js';
import GetAonyxBuddyStreamEventListener from './stream-event-listener/index.js';
import { GetTextToSpeech } from './text-to-speech/index.js';
import { GetAonyxBuddyInstanceConfig } from './database/index.js';
import { IAonyxBuddyInstance } from './database/config-types.js';
import { ConvertInstanceConfigToLegacyConfig } from './database/legacy/convert-legacy.js';
import * as StreamEvents from '@aonyxbuddy/stream-events';

import { Manipulation, Detection } from './stream-events/index.js';
import { GetCoreInstance } from './index.js';

import * as wsclient from "@aonyxbuddy/websocket-client";

async function main() {
	//* Preparing Body Styling 
	document.body.style.margin = '0 0';
	document.body.style.padding = '0 0';

	const config = (await GetAonyxBuddyInstanceConfig()) as unknown as IAonyxBuddyInstance;
	const aonyxbuddyinstance = GetCoreInstance(config);

	const legacyConfig = ConvertInstanceConfigToLegacyConfig(config);
	//* Text To Speech
	const tts = GetTextToSpeech(config?.texttospeech);


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
				if (typeof rendererParams.talking !== "undefined") {
					rendererParams.talking.value = Math.floor(config.rendering.spriteRendering.sprites['talking'].length * amplitude);
				}
			}, 1000 / 60);

			tts.Speak(speechRequest.text, () => {
				clearInterval(interval);
				if (rendererParams.talking) {
					rendererParams.talking.value = 0;
				}
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

	//!~~~~~~~~~~~~~

	//* StreamEventParser

	function ParseEvent(streamEvent: StreamEvents.AonyxBuddyStreamEvent) {
		const response = StreamEventParser.Parser.GetResponse(legacyConfig.responses, streamEvent, 'voice');
		AppendToSpeechQueue(response)

		//* Special Condition for Subscription (Sub Messages)

		if ((streamEvent.type === StreamEvents.AonyxBuddyStreamEventTypes.SUBSCRIBER) || (streamEvent.type === StreamEvents.AonyxBuddyStreamEventTypes.CHEER)) {
			AppendToSpeechQueue(streamEvent.message?.text ?? '');
		}
	}

	function ParseOther(otherEvent: StreamEvents.AonyxBuddyStreamEvent) {
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
			const customChatFirstResponse = StreamEventParser.Parser.GetResponse(legacyConfig.responses, otherEvent.original, 'chat-first-custom', otherEvent.username);
			const generalChatFirstResponse = StreamEventParser.Parser.GetResponse(legacyConfig.responses, otherEvent.original, 'voice', 'chat-first');
			AppendToSpeechQueue(customChatFirstResponse.length > 0 ? customChatFirstResponse : generalChatFirstResponse);
			SpeakInQueue();
			Log('info', generalChatFirstResponse);
		} else {
			Log('info', 'ParseOther: "type" is not chat-first');
		}

		Log('error', otherEvent);
	}


	const command_prefixes = config.commands.prefixes;

	function ParseCommand(event: StreamEvents.AonyxBuddyStreamEvent) {
		if (event.type !== 'command') return;
		const command = event.command.action.toLocaleLowerCase();
		switch (command) {
			case 'debug':
				Log('log', 'Muted:', isMuted);
				Log('log', 'SkipCount:', skipCount);
				Log('log', speechQueue);
				break;
			case 'say':
				Log('info', 'say command called');
				InsertToSpeechQueue(event.command.args);
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
				if (event.command.args.trim().length < 1) {
					Log('info', 'skip arg is empty, therefore using 1 as default');
					SkipSpeech(1);
				} else if (!isNaN(+event.command.args.trim())) {
					Log('info', 'skip arg is number');
					SkipSpeech(Math.max(0, +event.command.args));
				} else if (event.command.args.trim() === 'all') {
					Log('info', 'skip all command');
					SkipAllSpeech();
				} else if (event.command.args.trim() === 'clear') {
					Log('info', 'skip clear command');
					skipCount = 0;
				}
				break;
		}
	}

	//Sprite Renderer
	const rendererParams: Record<string, IRendererParam> = {
		talking: {
			value: 0,
			min: 0,
			max: config.rendering.spriteRendering.sprites["talking"].length
		},
		base: {
			value: 0,
			min: 0,
			max: config.rendering.spriteRendering.sprites["base"].length
		}
	};

	//	let talkingFrame = 0;
	//	let idleFrame = 0;

	const renderer = SpriteRendering.default(config.rendering.spriteRendering).then(renderer => {
		if (renderer instanceof Error) throw (renderer);
		Render(renderer);
		if (renderer.sprites['base'].bitmap.length > 0)
			FlipBaseImage(renderer);
	});

	function Render(renderer: SpriteRendering.Types.IRenderer) {
		renderer.ClearCanvas();
		renderer.RenderSprite('base', rendererParams?.base.value ?? 0);
		renderer.RenderSprite('mute', mutedFrame);
		const talkingFrame = Math.floor(rendererParams?.talking.value ?? 0 % (rendererParams?.talking.max ?? 1 - 1));
		renderer.RenderSprite('talking', talkingFrame, () => { Render(renderer); });
	}

	function FlipBaseImage(renderer: SpriteRendering.Types.IRenderer) {
		if (typeof rendererParams.base !== "undefined") {
			rendererParams.base.max = renderer.sprites["base"].bitmap.length;
			rendererParams.base.value += 1;
			rendererParams.base.value %= rendererParams.base.max;
			rendererParams.base.value = Math.floor(rendererParams.base.value);
			setTimeout(() => {
				FlipBaseImage(renderer);
			}, renderer.sprites['base'].delay[Math.floor(rendererParams.base.value)]);
		}
	}



	//Stream Events
	function OnEventReceived(rawEvent: StreamEvents.AonyxBuddyStreamEvent) {
		let streamEvent = rawEvent;
		streamEvent = Manipulation.FilterBannedWords(streamEvent, config.security.blockedWords, 'ploop', false);
		streamEvent = Manipulation.ParseCommand(streamEvent, config.commands.prefixes, config.commands.actions);
		streamEvent = Manipulation.IgnoreCommandWithoutPermission(streamEvent, 'CommandPermission');
		streamEvent = Manipulation.FilterEmojis(streamEvent, '');
		streamEvent = Manipulation.FilterCheers(streamEvent, ' ');
		streamEvent = Manipulation.IgnoreFromBlacklist(streamEvent, config.security.blacklist);
		streamEvent = Manipulation.IgnoreFromBotlist(streamEvent, config.users.botlist);
		streamEvent = Manipulation.ProcessNicknames(streamEvent, config.users.nicknames);
		streamEvent = Manipulation.IgnoreWithCondition(streamEvent, !isMuted, 'MuteToggle');
		streamEvent = Detection.DetectFirstEvent(streamEvent, ParseOther);
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
	
	wsclient.GetWebSocketClient({
		url: "wss://www.aonyxlimited.com/api/v1/ws",
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHJlYW0iOiJ3YXRlcmthdHR2IiwicmVhZCI6dHJ1ZSwid3JpdGUiOmZhbHNlfQ.guLyZ35l1Hal-_1q8DvMkYxfacOK_W8UDTbOmdXhH5U",
		logging: 'none',
		callback: (event: any) => {
			window.dispatchEvent(
				new CustomEvent(
					event.tstype ?? "aonyxbuddy-event",
					{ detail: event }
				)
			);
		}
	});

	AppendToSpeechQueue(`'A-onyx Buddy systems online. ${config.instance_nickname}, is active.'`);
	SpeakInQueue();
}
main();