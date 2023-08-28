import { Subscription, SubscriptionType } from "@aonyxbuddy/subscriptions";
import { IDictionary } from '../dictionaries/index';

export interface IAnimationState {
    id: string;
    animate: () => Promise<void>;
}

interface IAnimationTransition {
    origin: string;
    transition?: string;
    destination: string;
    weight?: number;
}

export class AnimationStateManager {
    private animationMap: IDictionary<IAnimationState> = {}
    private transitionMap: IDictionary<IAnimationTransition[]> = {}

    private transitionRequests: string[] = [];
    private stateSubscription: Subscription<string> = new Subscription();

    private running: boolean = false;

    private currentState: IAnimationState;
    //private currentStateID: string;

    constructor() {
        this.addState({
            id: 'idle',
            animate: async () => {
                //console.log('Default Idle is setup');
                await this.Sleep(1000);
            }
        });
        //this.currentStateID = 'idle',
        this.currentState = this.animationMap['idle'];
    }

    Start(): void {
        if (this.running) {
            console.error('AnimationStateManager already started.');
            return;
        }
        this.currentState = this.animationMap['idle'];
        this.running = true;
        this.UpdateLoop();
    }

    Stop(): void { this.running = false; }


    GetState(): string {
        return this.currentState?.id || 'idle';
    }


    private Sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

    private nextFrame(): Promise<void> {
        return new Promise<void>(resolve => {
            requestAnimationFrame(() => {
                resolve();
            });
        });
    }

    private async UpdateLoop() {
        while (this.running) {
            await Promise.all([
                this.Update().catch(error => console.error(error)),
                this.nextFrame()
            ]);
            await this.Sleep(10);
        }
    }

    private async Update() {
        const currentStateID: string = this.GetState();

        if (this.transitionRequests.length > 0) {
            const stateIDRequest = this.transitionRequests[0];
            const isCurrentStateMatch = AnimationStateManager.stateIDResolver(stateIDRequest, currentStateID);

            if (isCurrentStateMatch) {
                this.transitionRequests.shift();
                this.stateSubscription.invoke(stateIDRequest);
            }
        }

        await this.currentState.animate();

        let nextAnimation: IAnimationState | null = null;
        //        const requests = this.transitionRequests.length;
        if (this.transitionRequests.length > 0) {
            const animationPromise = this.GetDirectedTransition(this.transitionRequests[0], currentStateID).catch(e => console.error(e));
            const awaitedAnimationPromise: IAnimationState | void = await animationPromise;
            if (awaitedAnimationPromise) {
                nextAnimation = awaitedAnimationPromise;
            }
        } else {
            nextAnimation = await this.GetWeightedTransition();
        }

        if (nextAnimation) {
            this.currentState = nextAnimation;
        }
    }

    private async GetWeightedTransition(): Promise<IAnimationState | null> {
        const rawTransitionList = this.transitionMap[this.GetState()];
        const transitions: IAnimationTransition[] = [];

        for (const rawTransition of rawTransitionList) {
            if (rawTransition.destination.includes('*')) {
                const destinations = this.GetAnimationsWithID(rawTransition.destination);
                for (const destination of destinations) {
                    transitions.push({ ...rawTransition, destination: destination.id })
                }
            } else {
                transitions.push(rawTransition);
            }
        }

        if (transitions.length < 1)
            return null;

        const totalWeight = transitions.reduce((sum, transition) => sum += transition.weight ?? 1, 0);

        if (totalWeight <= 0)
            return null;

        let randomSelection = Math.random() * totalWeight;

        for (const transition of transitions) {
            randomSelection -= transition.weight ?? 1;
            if (randomSelection <= 0) {
                if (transition.transition)
                    await this.GetAnimationsWithID(transition.transition).shift()?.animate();
                return this.GetAnimationsWithID(transition.destination).shift() ?? null;
            }
        }

        return null;
    }

    private async GetDirectedTransition(requestedStateID: string, originID: string): Promise<IAnimationState | null> {

        if (AnimationStateManager.stateIDResolver(requestedStateID, originID) || !this.transitionMap[originID])
            return null;

        const ExpandTransitionWildcard = (originID: string) => {
            const transitions: IAnimationTransition[] = [];
            const rawTransitionList = this.transitionMap[originID];
            for (const rawTransition of rawTransitionList) {
                if (rawTransition.destination.includes('*')) {
                    const destinations = this.GetAnimationsWithID(rawTransition.destination);
                    for (const destination of destinations) {
                        transitions.push({ ...rawTransition, destination: destination.id })
                    }
                } else {
                    transitions.push(rawTransition);
                }
            }
            return transitions;
        }

        const transitions: IAnimationTransition[] = [];
        transitions.push(...ExpandTransitionWildcard(originID));

        const checkedQueue: IAnimationTransition[] = [];
        const InCheckedQueue = (input: IAnimationTransition) => {
            return checkedQueue.some(checkedValue =>
                input.origin === checkedValue.origin &&
                input.transition === checkedValue.transition &&
                input.destination === checkedValue.destination
            )
        }

        while (transitions.length > 0) {
            const workingTransition = transitions.shift();
            if (!workingTransition) continue;
            if (InCheckedQueue(workingTransition)) continue;
            checkedQueue.push(workingTransition);

            //By this point we have never checked this transition
            const isEndpoint = AnimationStateManager.stateIDResolver(requestedStateID, workingTransition.destination);

            if (isEndpoint) {
                let currentOrigin = workingTransition.origin;
                let currentTransition = workingTransition;

                const backtrackingTransitions: IAnimationTransition[] = [workingTransition];
                const checkedBacktrackingTransitions: IAnimationTransition[] = [];

                while (currentOrigin != originID && backtrackingTransitions.length > 0) {
                    const currentBacktrack = backtrackingTransitions.shift();
                    if (!currentBacktrack) continue;
                    if (checkedBacktrackingTransitions.some(
                        possibleChecked =>
                            currentBacktrack.origin === possibleChecked.origin &&
                            currentBacktrack.destination === possibleChecked.destination
                    )) continue;
                    checkedBacktrackingTransitions.push(currentBacktrack);

                    checkedQueue.filter(transition => currentBacktrack.origin === transition.destination).forEach(transition => {
                        backtrackingTransitions.push(transition);
                    })

                    currentTransition = currentBacktrack;
                    currentOrigin = currentBacktrack.origin;
                }

                if (currentTransition.origin != originID)
                    return null;

                if (currentTransition.transition)
                    await this.GetAnimationsWithID(currentTransition.transition).shift()?.animate();
                return this.GetAnimationsWithID(currentTransition.destination).shift() ?? null;
            } else {
                transitions.push(...ExpandTransitionWildcard(workingTransition.destination));
            }
        }

        return null;
    }

    addState(_state: IAnimationState) {
        this.animationMap[_state.id] = _state;

        if (this.currentState?.id === _state.id) {
            this.currentState = this.animationMap[_state.id];
        }
    }

    addTransition(startID: string, endID: string, transitionID?: string, weight?: number): void {
        if (startID.includes('*')) {
            console.error('Wildcard not allowed in startID');
            return;
        }

        if (this.GetAnimationsWithID(startID).length < 1) {
            console.error(`StartID:${startID} has not been added as a state`);
            return;
        }

        if (!this.transitionMap[startID]) {
            this.transitionMap[startID] = [];
        }

        const newTransition: IAnimationTransition = {
            origin: startID,
            destination: endID,
            transition: transitionID,
            weight: weight
        }

        this.transitionMap[startID].push(newTransition);
    }

    async RequestAnimation(requestedStateID: string): Promise<void> {
        this.transitionRequests.push(requestedStateID);

        //console.log('requested: ', requestedStateID, this.transitionRequests);

        await new Promise<void>(resolve => {
            const stateResolved = (stateID: string) => {
                if (AnimationStateManager.stateIDResolver(requestedStateID, stateID)) {
                    resolve();
                    return 'single-use' as SubscriptionType;
                }
                return;
            };
            this.stateSubscription.subscribe(stateResolved);
        });
    }

    private GetAnimationsWithID(requestedID: string) {
        const animations = []
        for (const key in this.animationMap) {
            if (AnimationStateManager.stateIDResolver(requestedID, key)) {
                animations.push(this.animationMap[key]);
            }
        }
        return animations;
    }

    private static stateIDResolver(request: string, state: string): boolean {
        if (request.startsWith('*')) {
            return state.endsWith(request.substring(1));
        }
        if (request.endsWith('*')) {
            return state.startsWith(request.substring(0, request.length - 1));
        }
        return request === state;
    }

}   
