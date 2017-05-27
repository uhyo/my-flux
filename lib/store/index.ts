import {
    Reducer,
} from '../reducer/reducer';

/**
 * Store that one can listen to and dispatch an event to.
 */
export class Store<S, A>{
    protected reducer: Reducer<S, A>;
    protected state: S | undefined;
    protected listeners: Array<(state: S)=>void>;

    constructor(reducer: Reducer<S, A>, initialState?: S){
        this.reducer = reducer;
        this.state = initialState;
        this.listeners = [];

        this.dispatch = this.dispatch.bind(this);
        this.getState = this.getState.bind(this);
    }
    /**
     * Returns current state.
     * @returns Current state.
     */
    public getState(): S{
        const {
            state,
        } = this;
        if (state == null){
            throw new Error('Store is not initialized');
        }
        return state;
    }
    /**
     * Subscribes to the store. 
     * @returns Unsubscribe function.
     */
    public subscribe(f: (state: S)=>void): (()=>void){
        let listening = true;
        this.listeners.push(f);
        return ()=>{
            if (listening !== true){
                return;
            }
            const idx = this.listeners.indexOf(f);
            if (idx !== -1){
                this.listeners.splice(idx, 1);
            }
        };
    }
    /**
     * Dispatches an action to the store.
     * @param action Action.
     * @returns the passed action.
     */
    public dispatch<AA extends A>(action: AA): AA{
        const {
            state,
            reducer,
        } = this;
        const nextState = reducer(state, action);
        this.state = nextState;

        // Publish to the listeners.
        for (const f of this.listeners){
            f(nextState);
        }

        return action;
    }
}
