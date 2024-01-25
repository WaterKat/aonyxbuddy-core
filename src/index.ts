import { IAonyxBuddyInstance } from './database/config-types.js';

import pino from 'pino';
const Logger = pino();

import * as ABSE from "@aonyxbuddy/stream-events";
import { IClientConfig } from './database/legacy/iclient-config.js';
import { ConvertInstanceConfigToLegacyConfig } from './database/legacy/convert-legacy.js';
import { GetTextToSpeech } from './text-to-speech/index.js';
import { ITextToSpeechWrapper } from './text-to-speech/types.js';
import { GetSpeechQueue } from './sequencing/speech-queue.js';
import { IRendererParam } from './sprite-rendering/types.js';
import { GetSpeechSkipping } from './features/speech-skipping.js';
import { GetMuteWrapper } from './features/muteing.js';
import { Manipulation, Detection } from './stream-events/index.js';
import * as StreamEventParser from './stream-event-parser/index.js';
import { AonyxBuddyStreamEvent, AonyxBuddyStreamEventTypes } from '@aonyxbuddy/stream-events';

import GetAonyxBuddyStreamEventListener from './stream-event-listener/index.js';
import StreamElements from './stream-elements/index.js';


interface AonyxBuddyInstanceWrapper {
    rendererParams: Record<string, IRendererParam>,
}

export async function GetCoreInstance(config: IAonyxBuddyInstance): Promise<AonyxBuddyInstanceWrapper> {
    const legacyConfig: IClientConfig = ConvertInstanceConfigToLegacyConfig(config);

    const texttospeech = GetTextToSpeech(config.texttospeech);
    
    const rendererParams : Record<string, IRendererParam> = {
        base: {
            value: 0,
            min: 0,
            max: 0
        },
        talking: {
            value: 0,
            min: 0,
            max: 1
        },
        mute: {
            value: 0,
            min: 0,
            max: 1
        }
    }
    const speechQueueWrapper = GetSpeechQueue(texttospeech, rendererParams.talking);
    const speechSkippingWrapper = GetSpeechSkipping(speechQueueWrapper)
    const muteWrapper = GetMuteWrapper(speechSkippingWrapper, rendererParams.mute);

	//* StreamEventParser

	function ParseEvent(streamEvent: AonyxBuddyStreamEvent) {
		const response = StreamEventParser.Parser.GetResponse(legacyConfig.responses, streamEvent, 'voice');
		speechQueueWrapper.AppendToSpeechQueue(response)

		//* Special Condition for Subscription (Sub Messages)

		if ((streamEvent.type === AonyxBuddyStreamEventTypes.SUBSCRIBER) || (streamEvent.type === AonyxBuddyStreamEventTypes.CHEER)) {
			speechQueueWrapper.AppendToSpeechQueue(streamEvent.message?.text ?? '');
		}
	}

	function ParseOther(otherEvent: AonyxBuddyStreamEvent) {
		if (otherEvent.type !== 'other') {
			Logger.info( 'ParseOther: Event not "other" type');
			return;
		}

		if (!otherEvent.other) {
			Logger.info( 'ParseOther: event "other" field not set');
			return;
		}

		if (!otherEvent.other.type) {
			Logger.info( 'ParseOther: "type" field not set');
			return;
		}

		if (otherEvent.other.type === 'chat-first' && otherEvent.original.type === 'chat') {
			const customChatFirstResponse = StreamEventParser.Parser.GetResponse(legacyConfig.responses, otherEvent.original, 'chat-first-custom', otherEvent.username);
			const generalChatFirstResponse = StreamEventParser.Parser.GetResponse(legacyConfig.responses, otherEvent.original, 'voice', 'chat-first');
			speechQueueWrapper.AppendToSpeechQueue(customChatFirstResponse.length > 0 ? customChatFirstResponse : generalChatFirstResponse);
			speechQueueWrapper.SpeakInQueue();
			Logger.info( generalChatFirstResponse);
		} else {
			Logger.info( 'ParseOther: "type" is not chat-first');
		}

		Logger.error(otherEvent);
	}


	const command_prefixes = config.commands.prefixes;

	function ParseCommand(event: AonyxBuddyStreamEvent) {
		if (event.type !== 'command') return;
		const command = event.command.action.toLocaleLowerCase();
		switch (command) {
			case 'debug':
				Logger.info('Muted:', muteWrapper.isMuted);
				Logger.info( 'SkipCount:', speechSkippingWrapper.skipCount);
				Logger.info( speechQueueWrapper.speechQueue);
				break;
			case 'say':
				Logger.info( 'say command called');
				speechQueueWrapper.InsertToSpeechQueue(event.command.args);
				break;
			case 'mute':
				Logger.info( 'mute called');
				muteWrapper.SetMuted();
				break;
			case 'unmute':
				Logger.info( 'unmute called');
				muteWrapper.SetUnmuted();
				break;
			case 'skip':
				Logger.info( 'skip command called');
				if (event.command.args.trim().length < 1) {
					Logger.info( 'skip arg is empty, therefore using 1 as default');
					speechSkippingWrapper.SkipSpeech(1);
				} else if (!isNaN(+event.command.args.trim())) {
					Logger.info( 'skip arg is number');
					speechSkippingWrapper.SkipSpeech(Math.max(0, +event.command.args));
				} else if (event.command.args.trim() === 'all') {
					Logger.info( 'skip all command');
					speechSkippingWrapper.SkipAllSpeech();
				} else if (event.command.args.trim() === 'clear') {
					Logger.info( 'skip clear command');
					speechSkippingWrapper.skipCount = 0;
				}
				break;
		}
	}

	//Stream Events
	function OnEventReceived(rawEvent: AonyxBuddyStreamEvent) {
		let streamEvent = rawEvent;
		streamEvent = Manipulation.FilterBannedWords(streamEvent, config.security.blockedWords, 'ploop', false);
		streamEvent = Manipulation.ParseCommand(streamEvent, config.commands.prefixes, config.commands.actions);
		streamEvent = Manipulation.IgnoreCommandWithoutPermission(streamEvent, 'CommandPermission');
		streamEvent = Manipulation.FilterEmojis(streamEvent, '');
		streamEvent = Manipulation.FilterCheers(streamEvent, ' ');
		streamEvent = Manipulation.IgnoreFromBlacklist(streamEvent, config.security.blacklist);
		streamEvent = Manipulation.IgnoreFromBotlist(streamEvent, config.users.botlist);
		streamEvent = Manipulation.ProcessNicknames(streamEvent, config.users.nicknames);
		streamEvent = Manipulation.IgnoreWithCondition(streamEvent, !muteWrapper.isMuted, 'MuteToggle');
		streamEvent = Detection.DetectFirstEvent(streamEvent, ParseOther);
		console.info('RawEvent:', streamEvent);
		if (streamEvent.type === 'other') {
			ParseOther(streamEvent);
		} else if (streamEvent.type === 'command') {
			ParseCommand(streamEvent);
		} else {
			ParseEvent(streamEvent);
		}

		speechSkippingWrapper.SkipSpeech();

		speechQueueWrapper.SpeakInQueue();
	}

	StreamElements(OnEventReceived);
	GetAonyxBuddyStreamEventListener(OnEventReceived);
/*	
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
*/
	speechQueueWrapper.AppendToSpeechQueue(`'A-onyx Buddy systems online. ${config.instance_nickname}, is active.'`);
	speechQueueWrapper.SpeakInQueue();
    
    const wrapper: AonyxBuddyInstanceWrapper = {
        rendererParams
    };
    return wrapper;
}