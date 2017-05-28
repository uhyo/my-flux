import {
    Reducer,
} from '../../../typings/reducer';
import {
    Store,
} from '../../../typings/store';

interface Action{
    type: 'foo';
    value: string;
}

interface FooState{
    value: string;
}

const fooReducer: Reducer<FooState, Action> = (state: FooState)=> state;

const store = new Store(fooReducer);

store.subscribe(state=>{
    // state should have type FooState
    state.value;
});

