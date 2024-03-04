const NAME_TAG: string = 'aonyxbuddy';

/** Available Tags for use with the Log function, similar to console.log, console.warn, etc */
type LogTag = 'log' | 'error' | 'info' | 'warn';

/**
 * Intermediary for logging to standardize logging for the app, as well as 
 * possbly add logging to remote servers
 * @param tag the tag to identify the type of log to ouput
 * @param args the values to be outputted
 * @returns void
 */
export default function Log(tag: LogTag, ...args: any): void {
    console[tag](`[${NAME_TAG}:${tag === 'log' ? '' : `/${tag}`}]`, ...args);
    return;
}