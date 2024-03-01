import { Types } from '../core/stream-events/index.js';
import { StreamEventType } from '../core/stream-events/types.js';

import * as SETypes from './types.js';

export default function TranslateStreamElementsEventToAonyxEvent(_event: any): Types.StreamEvent | undefined {
    function messageFromString(_message: string): Types.ChatMessage {
        return {
            text: _message ?? '',
            emotes: []
        }
    }

    function translateMessage(_event: any): Types.StreamEvent {
        const seMessage: SETypes.SEMessageEvent = _event;
        const aonyxMessage: Types.StreamEvent = {
            tstype: StreamEventType.TS_TYPE,
            type: StreamEventType.CHAT,
            username: seMessage.data.nick,
            nickname: seMessage.data.displayName ?? seMessage.data.nick,
            message: {
                text: seMessage.data.text,
                emotes: seMessage.data.emotes.map(seEmote => ({ type: seEmote.type, name: seEmote.name }))
            },
            permissions : {
                chatter : true,
                follower : false,
                subscriber : seMessage.data.tags.subscriber === '1',
                vip : seMessage.data.tags.vip === '1',
                moderator : seMessage.data.tags.mod === '1',
                streamer : seMessage.data.channel === seMessage.data.nick
            }
        }
        return aonyxMessage;
    }

    function translateOther(_event: any): Types.StreamEvent | undefined {
        //Gift Parsing
        if (_event.type === 'subscriber') {
            if (_event.bulkGifted || _event.isCommunityGift || _event.gifted) {
                _event.type = 'gift';
            }
        }

        const seEvent: SETypes.SEBasicEvent = _event as SETypes.SEBasicEvent;
        let aonyxEvent: Types.StreamEvent;
        const base : {tstype: StreamEventType.TS_TYPE, username:string} = {
            tstype: StreamEventType.TS_TYPE,
            username: seEvent.name,
        }
        switch (seEvent.type) {
            case 'follower':
                aonyxEvent = {
                    ...base,
                    type: StreamEventType.FOLLOW
                };
                break;
            case 'subscriber':
                aonyxEvent = {
                    ...base,
                    type: StreamEventType.SUBSCRIBER,
                    subscriber_length: seEvent.amount,
                    message: messageFromString(seEvent.message)
                };
                break;
            case 'gift':
                if (+seEvent.bulkGifted > 0) {
                    //bulk-sent
                    aonyxEvent = {
                        ...base,
                        username: seEvent.sender,
                        type: StreamEventType.GIFT_BULK_SENT,
                        gift_count: +seEvent.amount || 1
                    }
                } else if (+seEvent.isCommunityGift > 0) {
                    //bulk-received
                    aonyxEvent = {
                        ...base,
                        username: seEvent.sender,
                        type: StreamEventType.GIFT_BULK_RECEIVED,
                        gift_receiver: seEvent.name
                    }
                } else {
                    //single
                    aonyxEvent = {
                        ...base,
                        username: seEvent.sender,
                        type: StreamEventType.GIFT_SINGLE,
                        gift_receiver: seEvent.name,
                    }
                }
                break;
            case 'raid':
                aonyxEvent = {
                    ...base,
                    type: StreamEventType.RAID,
                    raid_count: +seEvent.amount || 0
                }
                break;
            case 'cheer':
                aonyxEvent = {
                    ...base,
                    type: StreamEventType.CHEER,
                    cheer_amount: seEvent.amount || 0,
                    message: messageFromString(seEvent.message)
                }
                break;
            //case 'chat':
            //break;
            default:
                return undefined
                break;
        }

        return aonyxEvent;
    }

    if (_event.type !== 'message') {
        return translateOther(_event);
    } else {
        return translateMessage(_event);
    }
}
