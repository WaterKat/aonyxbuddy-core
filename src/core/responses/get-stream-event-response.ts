import { EStreamEventType, GetTMessageEvent, IsTMessageStreamEvent, TMessageEvent, TStreamEvent } from "../stream-events/types.js";
import { GetRandomResponse, IRandomResponseOptions } from "./get-random-response.js";
import { ISubstitutionMap, SubstuteAllInSubstitutionMap } from "./substitute-response-vars.js";

/**
 * Get a substitution map from a stream event for use with SubstituteStringVar
 * @param event the stream event to get a substitution map from
 * @returns a substitution map from the stream event
 */
export function GetSubstitutionMapFromEvent(
    event: TStreamEvent
): ISubstitutionMap {
    return {
        "nickname": event.nickname ?? event.username,
        "subscriber.length": event.type === EStreamEventType.SUBSCRIBER ?
            event.length.toString() : "",
        "subscriber.plural": event.type === EStreamEventType.SUBSCRIBER ?
            ((event.length ?? 0) > 1) ? "s" : "" : "",
        "gift.receiver": event.type === EStreamEventType.GIFT_BULK_RECEIVED ?
            event.receiver ?? "" : "",
        "gift.count": event.type === EStreamEventType.GIFT_BULK_SENT ?
            event.count.toString() ?? "" : "",
        "raid.count": event.type === EStreamEventType.RAID ?
            event.count.toString() ?? "" : "",
        "raid.plural": event.type === EStreamEventType.RAID ?
            ((event.count ?? 0) > 1) ? "s" : "" : "",
        "cheer.amount": event.type === EStreamEventType.CHEER ?
            event.amount.toString() || "" : "",
        "cheer.plural": event.type === EStreamEventType.CHEER ?
            ((event.amount ?? 0) > 1) ? "s" : "" : "",
        "message.text": IsTMessageStreamEvent(event) ?
            (event as TMessageEvent).message.text ?? "" : ""
    };
}

/** */

/**
 * Get a stream event response
 * @param options a response array dictionary that contains desired responses 
 * for a given key
 * @param event the stream event to get a response for
 * @returns a stream event response
 */
export function GetStreamEventResponse(
    event: TStreamEvent,
    options: IRandomResponseOptions
): string {
    return SubstuteAllInSubstitutionMap(
        GetSubstitutionMapFromEvent(event),
        GetRandomResponse(options)
    );
}
