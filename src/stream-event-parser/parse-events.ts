import { TStreamEvent, EStreamEventType } from "../core/stream-events/types.js";
import { GetResponse } from "./stream-event-parser.js";
import { IResponses } from "./types.js";

type IEventResponse = {
    action: "none"
} | {
    action: "speak",
    message: string
} | {
    action: "command"
}

function ParseOther(event: TStreamEvent): IEventResponse {
    if (event.type !== EStreamEventType.OTHER) return { action: "none" }; // so ts stops complaining

    if (event.other.type === "chat-first" && event.original.type === "chat") {
        const customChatFirstResponse = GetResponse(
            config.responses,
            event.original,
            "chat-first-custom",
            event.username
        );
        const generalChatFirstResponse = StreamEventParser.Parser.GetResponse(
            config.responses,
            event.original,
            "voice",
            "chat-first"
        );
        aonyxbuddy.TextQueue.Append(
            customChatFirstResponse.length > 0
                ? customChatFirstResponse
                : generalChatFirstResponse
        );
        Log("info", generalChatFirstResponse);
    } else {
        Log("info", 'ParseOther: "type" is not chat-first');
    }

    Log("error", event);
}

/**
 * Takes in a preprocessed event, and returns what action should be taken
 * @param streamEvent - a preprocessed aonybuddy event
 * @return eventResponse - an instruction to be taken in response to this event
 */
function ParseEvent(respponses: IResponses, streamEvent: TStreamEvent): IEventResponse {
    if (
        (streamEvent.type === EStreamEventType.FOLLOW) ||
        (streamEvent.type === EStreamEventType.SUBSCRIBER) ||
        (streamEvent.type === EStreamEventType.GIFT_SINGLE) ||
        (streamEvent.type === EStreamEventType.GIFT_BULK_SENT) ||
        (streamEvent.type === EStreamEventType.GIFT_BULK_RECEIVED) ||
        (streamEvent.type === EStreamEventType.RAID) ||
        (streamEvent.type === EStreamEventType.CHEER) ||
        (streamEvent.type === EStreamEventType.REDEEM)
    ) {
        return {
            action: "speak",
            message: GetResponse(respponses, streamEvent, "voice")
        }
    } else if (streamEvent.type === EStreamEventType.COMMAND) {
        return {
            action: "command"
        }
    } else if (streamEvent.type === EStreamEventType.OTHER) {
        if (
            (streamEvent.other.type === "chat-first") &&
            (streamEvent.original.type === "chat")
        ) {
            return {
                action: "speak",
                message: GetResponse(respponses, streamEvent, "voice")
            }
        } else {
            return {
                action: "none"
            }
        }
    } else {
        return {
            action: "none"
        }
    }

    if (streamEvent.type === EStreamEventType.OTHER) {
        ParseOther(streamEvent);

    }

    const response = StreamEventParser.Parser.GetResponse(
        config.responses,
        streamEvent,
        "voice"
    );
    aonyxbuddy.TextQueue.Append(response);

    //* Special Condition for Subscription (Sub Messages)

    if (
        streamEvent.type === StreamEvents.Types.StreamEventType.SUBSCRIBER ||
        streamEvent.type === StreamEvents.Types.StreamEventType.CHEER
    ) {
        aonyxbuddy.TextQueue.Append(streamEvent.message?.text ?? "");
    }
}