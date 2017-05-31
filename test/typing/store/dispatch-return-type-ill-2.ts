import {
    Reducer,
} from '../../../dist/typings/reducer';
import {
    Store,
} from '../../../dist/typings/store';

interface FooAction{
    type: 'foo';
    value: string;
}
interface BarAction{
    type: 'bar';
    value2: 'on' | 'off';
}
type Action = FooAction | BarAction;

interface FooState{
    value: string;
}

const fooReducer: Reducer<FooState, Action> = (state: FooState)=> state;

const store = new Store(fooReducer);

// action2 should implicitly have type FooAction.
let action2 = store.dispatch({
    type: 'foo',
    value: 'nom',
});

action2 = 6;

