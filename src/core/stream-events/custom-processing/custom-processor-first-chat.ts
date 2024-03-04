import { EStreamEventType, TStreamEvent } from "../types.js";

/**
 * Options provided to the CustomProcessFirstChat function. includes an array of 
 * chatters to check against for the first chat event.
 */
export interface IProcessFirstChatOptions {
    chatters: string[];
}

/**
 * Response from the CustomProcessFirstChat function, includes the processed 
 * event and modified options based on whether or not the event was processed.
 */
export interface IProcessFirstEventResponse {
    event: TStreamEvent,
    options: IProcessFirstChatOptions
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
export const CustomProcessFirstChat = (
    event: TStreamEvent,
    options: IProcessFirstChatOptions
): IProcessFirstEventResponse => {
    if (event.type !== EStreamEventType.CHAT) {
        return {
            event: event,
            options: options
        }
    }
    if (options.chatters.includes(event.username)) {
        return {
            event: event,
            options: options
        }
    } else {
        return {
            event: <TStreamEvent>{
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
            options: {
                chatters: options.chatters.concat([event.username])
            }
        }
    }
}
