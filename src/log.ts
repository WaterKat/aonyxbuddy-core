const NAME_TAG: string = 'aonyxbuddy';

type LogTags = 'log' | 'error' | 'info' | 'warn';

export default function Log(tag: LogTags, ...args: any): void {
    console[tag](`[${NAME_TAG}:${tag === 'log' ? '' : `/${tag}`}]`, ...args);
    return;
}