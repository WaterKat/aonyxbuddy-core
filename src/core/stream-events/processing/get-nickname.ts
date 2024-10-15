import { Logger } from "../logger-monad.js";
import { TStreamEvent } from "../types.js";

/**
 * Options for processing a stream event with the ProcessNicknames function
 */
export interface NicknamesOptions {
  nicknameMap: { [key: string]: string[] };
  randomBetween01Func?: () => number;
}

/**
 * Take in a stream event and options, and return the event with the nickname
 * value assigned to a random nickname from the nicknameMap, or the username if
 * the username is not in the nicknameMap
 * @param event the event to process
 * @param options the options for processing the event
 * @returns the processed event
 */
export function GetNicknamesFunction(
  options?: NicknamesOptions
): (event: TStreamEvent) => Logger<TStreamEvent> {
  if (
    !options ||
    !options.nicknameMap ||
    Object.keys(options.nicknameMap).length === 0
  ) {
    return (event: TStreamEvent) =>
      new Logger(event, ["options not defined or nicknameMap is empty"]);
  }

  const randFunc = options.randomBetween01Func ?? Math.random;

  return function (event: TStreamEvent): Logger<TStreamEvent> {
    const deepCopy = JSON.parse(JSON.stringify(event)) as TStreamEvent;
    return new Logger(
      {
        ...deepCopy,
        nickname:
          options.nicknameMap[event.username] &&
          options.nicknameMap[event.username].length > 0
            ? options.nicknameMap[event.username][
                Math.floor(
                  randFunc() * options.nicknameMap[event.username].length
                )
              ]
            : event.username,
      },
      ["nickname assigned"]
    );
  };
}
