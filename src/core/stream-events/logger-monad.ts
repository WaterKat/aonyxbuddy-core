
export class Logger<T> {
    private value: T;
    private logs: string[];

    constructor(value: T, logs: string[] = []) {
        this.value = value;
        this.logs = logs;
    }

    map<R>(fn: (value: T) => Logger<R>) {
        const newValue = fn(this.value);
        return new Logger(
            newValue.getValue(),
            [...this.logs, ...newValue.getLogs()]
        );
    }

    log(log: string) {
        return new Logger(this.value, [...this.logs, log]);
    }

    getValue() {
        return this.value;
    }

    getLogs() {
        return this.logs;
    }
}