import { Subscription } from './subscription.js';

export interface ISubscriptee<TSubscriptionData> {
    subscription : Subscription<TSubscriptionData>
}
