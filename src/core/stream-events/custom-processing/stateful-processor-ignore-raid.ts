import { EStreamEventType, TStreamEvent } from "../types"

/**
 * Arguments for StatefulProcessIgnoreRaid function, includes the event to
 * process, the options for the process ignore raid function, and the state
 * for the process ignore raid function
 */
export interface IStatefulIgnoreRaidArgs {
    event: TStreamEvent,
    options: {
        ignoreTimeInSeconds: number,
        ignore: EStreamEventType[]
    }
    state: {
        lastRaid: Date
    }
}

/**
 * processes a raid event into an ignored event if the raid is within the ignore 
 * time, returns an unmodified event if it is not a raid event or the raid is 
 * not within the ignore time.
 * @param event the event to process, will not process if not a raid event and 
 * will not process if the event is outside the ignore time * 
 * @param options the options for the process ignore raid function, includes the 
 * time in seconds to ignore raids, and an array of event types to ignore
 * @param state the state for the process ignore raid function, includes the last
 * raid time
 * @returns The processed event and modified options based on whether or not the
 * event caused a state change
 */ 
/*
export const StatefulProcessIgnoreRaid = (
    { event, options, state }: IStatefulIgnoreRaidArgs
): IStatefulIgnoreRaidArgs => (
    event.type === EStreamEventType.RAID ?
        {
            event: event,
            options: options,
            state: {
                lastRaid: new Date()
            }
        }
        : event.type in options.ignore ?
            (new Date().getTime() - state.lastRaid.getTime()) / 1000 < options.ignoreTimeInSeconds ?
                {
                    event: {
                        tstype: event.tstype,
                        type: EStreamEventType.IGNORE,
                        username: event.username,
                        reason: "ignore raid"
                    },
                    options: options,
                    state: state
                }
                : { event: event, options: options, state: state }
            : { event: event, options: options, state: state }
); 
*/
export function StatefulProcessIgnoreRaid({ event, options, state }: IStatefulIgnoreRaidArgs): IStatefulIgnoreRaidArgs {
    if (event.type === EStreamEventType.RAID) {
        return {
            event: event,
            options: options,
            state: {
                lastRaid: new Date()
            }
        };
    } else if (options.ignore.includes(event.type)) {
        if ((new Date().getTime() - state.lastRaid.getTime()) / 1000 < options.ignoreTimeInSeconds) {
            return {
                event: {
                    tstype: event.tstype,
                    type: EStreamEventType.IGNORE,
                    username: event.username,
                    reason: "ignore raid"
                },
                options: options,
                state: state
            };
        } else {
            return { event: event, options: options, state: state };
        }
    } else {
        return { event: event, options: options, state: state };
    }
}