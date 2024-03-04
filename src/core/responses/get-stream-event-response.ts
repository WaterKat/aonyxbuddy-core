import { TStreamEvent } from "../stream-events/types.js";
import { GetRandomResponse, IResponseArray } from "./get-random-response.js";
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
        'nickname': event.nickname || event.username,
        'subscriber.length': event.subscriber_length?.toString() || '',
        'subscriber.plural': ((event.subscriber_length ?? 0) > 1) ? 's' : '',
        'gift.receiver': event.gift_receiver || '',
        'gift.count': event.gift_count?.toString() || '',
        'raid.count': event.raid_count?.toString() || '',
        'raid.plural': ((event.raid_count ?? 0) > 1) ? 's' : '',
        'cheer.amount': event.cheer_amount?.toString() || '',
        'cheer.plural': ((event.cheer_amount ?? 0) > 1) ? 's' : '',
        'message.text': event.message?.text || '',
    };
}

/**
 * Get a stream event response
 * @param responses a response array dictionary that contains desired responses 
 * for a given key
 * @param event the stream event to get a response for
 * @returns a stream event response
 */
export function GetStreamEventResponse(
    responses: IResponseArray,
    event: TStreamEvent
): string {
    return SubstuteAllInSubstitutionMap(
        GetSubstitutionMapFromEvent(event),
        GetRandomResponse(responses, event.type)
    );
}
