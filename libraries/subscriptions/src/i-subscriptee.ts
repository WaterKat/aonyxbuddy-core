import { Subscription } from "./subscription";

export interface ISubscriptee<TSubscriptionData> {
    subscription : Subscription<TSubscriptionData>
}
