import {
    Reducer,
} from '../../../dist/typings/reducer';
import {
    Store,
} from '../../../dist/typings/store';

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
    state.value2;
});


