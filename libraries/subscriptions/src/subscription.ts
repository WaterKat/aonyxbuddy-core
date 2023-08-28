export type SubscriptionType = void | 'single-use';

export class Subscription<TSubscriptionData> {
    private functions: Array<(param: TSubscriptionData) => SubscriptionType>;

    constructor() {
        this.functions = [];
    }

    subscriberCount() : number {
        return this.functions.length;
    }

    subscribe(_function: (param: TSubscriptionData) => SubscriptionType): boolean {
        if (typeof _function !== 'function') {
            return false;
        }
 
        if (this.functions.includes(_function)) {
            return false;
        }

        this.functions.push(_function);
        return true;
    }

    unsubscribe(_function: (param: TSubscriptionData) => SubscriptionType): boolean {
        if (typeof _function !== 'function') {
            return false;
        }

        if (!this.functions.includes(_function)) {
            return false;
        }

        const functionIndex = this.functions.indexOf(_function);
        if (functionIndex !== -1) {
            this.functions.splice(functionIndex, 1);
        }
        return true;
    }

    invoke(param: TSubscriptionData) {
        let i = 0;
        while (i < this.functions.length) {
            const returnVal = this.functions[i](param);
            if (returnVal === 'single-use') {
                this.functions.splice(i, 1);
            } else {
                i++;
            }
        }
    }
}
