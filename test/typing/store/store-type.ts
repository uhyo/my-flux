import {
    Reducer,
} from '../../../typings/reducer';
import {
    Store,
} from '../../../typings/store';

interface Action{
    'this is action': true;
}

interface FooState{
    value: string;
}

const fooReducer: Reducer<FooState, Action> = (state: FooState)=> state;

function readState(_state: FooState): void{
}

const store = new Store(fooReducer);

// state should have type FooState
const state = store.getState();

state.value = 'foo';

readState(state);
