import { Logger } from "../logger-monad.js";
import { EStreamEventType, TStreamEvent } from "../types";

/**
 * TODO - Add JSDoc comment
 */
export interface IStatefulIgnoreRaidOptions {
  ignoreTimeInSeconds?: number;
  ignore?: EStreamEventType[];
}

/**
 * Arguments for StatefulProcessIgnoreRaid function, includes the event to
 * process, the options for the process ignore raid function, and the state
 * for the process ignore raid function
 */
export interface IStatefulIgnoreRaidArgs {
  event: TStreamEvent;
  options: IStatefulIgnoreRaidOptions;
  state: {
    lastRaid: Date;
  };
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
export function StatefulProcessIgnoreRaid({
  event,
  options,
  state,
}: IStatefulIgnoreRaidArgs): IStatefulIgnoreRaidArgs {
  if (event.type === EStreamEventType.RAID) {
    return {
      event: event,
      options: options,
      state: {
        lastRaid: new Date(),
      },
    };
  } else if (options.ignore && options.ignore.includes(event.type)) {
    if (
      (new Date().getTime() - state.lastRaid.getTime()) / 1000 <
      (options.ignoreTimeInSeconds ?? 60)
    ) {
      return {
        event: {
          tstype: event.tstype,
          type: EStreamEventType.IGNORE,
          username: event.username,
          permissions: event.permissions,
          reason: "ignore raid",
        },
        options: options,
        state: state,
      };
    } else {
      return { event: event, options: options, state: state };
    }
  } else {
    return { event: event, options: options, state: state };
  }
}

/**
 * TODO - Add JSDoc comment
 * Temporary function to test the ignore raid function
 */
export function LoggedStatefulProcessIgnoreRaid(): (
  event: TStreamEvent
) => Logger<TStreamEvent> {
  let state = {
    lastRaid: new Date(2000, 1, 1),
  };

  const options: IStatefulIgnoreRaidOptions = {
    ignoreTimeInSeconds: 60,
    ignore: [EStreamEventType.FOLLOW, EStreamEventType.CHAT_FIRST],
  };

  return function (event: TStreamEvent): Logger<TStreamEvent> {
    const newEvent = StatefulProcessIgnoreRaid({
      event: event,
      options: options,
      state: state,
    });

    state = newEvent.state;

    return new Logger(newEvent.event).log(`latest raid: ${state.lastRaid}`);
  };
}
