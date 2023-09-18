const name = 'aonyxbuddy';
type tags = 'log' | 'error' | 'info';

export default function log(tag: tags, ...args : any) : void {
    console[tag](`[${name}:${tag}]`, ...args);
    return;
}