import { StreamEvent, StreamEventComponent } from '../../../stream-events/index';
import * as SETypes from './types';

export function TranslateStreamElementsEventToAonyxEvent(_event: any): StreamEvent | undefined {
    function messageFromString(_message: string): StreamEventComponent.Message {
        return {
            text: _message ?? '',
            emotes: []
        }
    }

    function translateMessage(_event: any): StreamEvent {
        const seMessage: SETypes.SEMessageEvent = _event;
        const aonyxMessage: StreamEvent = {
            type: 'chat',
            username: seMessage.data.nick,
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

    function translateOther(_event: any): StreamEvent | undefined {
        //Gift Parsing
        if (_event.type === 'subscriber') {
            if (_event.bulkGifted || _event.isCommunityGift || _event.gifted) {
                _event.type = 'gift';
            }
        }

        const seEvent: SETypes.SEBasicEvent = _event as SETypes.SEBasicEvent;
        let aonyxEvent: StreamEvent;
        const base = {
            username: seEvent.name,
        }
        switch (seEvent.type) {
            case 'follower':
                aonyxEvent = {
                    ...base,
                    type: 'follow'
                };
                break;
            case 'subscriber':
                aonyxEvent = {
                    ...base,
                    type: 'subscriber',
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
                        type: 'gift-bulk-sent',
                        gift_count: +seEvent.amount || 1
                    }
                } else if (+seEvent.isCommunityGift > 0) {
                    //bulk-received
                    aonyxEvent = {
                        ...base,
                        username: seEvent.sender,
                        type: 'gift-bulk-received',
                        gift_receiver: seEvent.name
                    }
                } else {
                    //single
                    aonyxEvent = {
                        ...base,
                        username: seEvent.sender,
                        type: 'gift-single',
                        gift_receiver: seEvent.name,
                    }
                }
                break;
            case 'raid':
                aonyxEvent = {
                    ...base,
                    type: 'raid',
                    raid_count: +seEvent.amount || 0
                }
                break;
            case 'cheer':
                aonyxEvent = {
                    ...base,
                    type: 'cheer',
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
