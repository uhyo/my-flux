import {
    Reducer,
} from '../../../dist/typings/reducer';
import {
    Store,
} from '../../../dist/typings/store';

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

// should cause error
state.vaooo = 3;

