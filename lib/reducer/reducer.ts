/**
 * Reducer.
 * A function that takes a state and an action and returns a new state.
 */
export type Reducer<S, A> = (state: S | undefined, action: A)=> S;
