import { EStreamEventType, TStreamEvent } from "../types.js";

/**
 * Arguments for StatefulProcessFirstChat function, includes the event to
 * process, the options for the process first chat function, and the state 
 * for the process first chat function
 */
export interface IStatefulFirstEventArgs {
    event: TStreamEvent,
    options: {},
    state: {
        chatters: string[]
    }
}

/**
 * CustomProcessFirstChat function, processes a chat event into a chat-first
 * event if the user is a first time chatter, returns an unmodified event if it 
 * is not a chat event or the user is not a first time chatter. 
 * @param event the event to process, will not process if not a chat event 
 * @param options the options for the process first chat function, includes the 
 * chatters array to check against
 * @returns The processed event and modified options based on whether or not the
 * event was processed
 */
export const StatefulProcessFirstChat = ({
    event,
    options,
    state
}: IStatefulFirstEventArgs): IStatefulFirstEventArgs => {
    if (event.type !== EStreamEventType.CHAT) {
        return {
            event: event,
            options: options,
            state: state
        }
    }
    if (state.chatters.includes(event.username)) {
        return {
            event: event,
            options: options,
            state: state
        }
    } else {
        return {
            event: {
                tstype: EStreamEventType.TS_TYPE,
                type: EStreamEventType.CHAT_FIRST,
                username: event.username,
                nickname: event.nickname,
                permissions: event.permissions,
                message: {
                    text: event.message.text,
                    emotes: event.message.emotes.map(emote => ({
                        type: emote.type,
                        name: emote.name
                    }))
                }
            },
            options: options,
            state: {
                chatters: state.chatters.concat([event.username])
            }
        }
    }
}
