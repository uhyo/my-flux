import {
    Reducer,
} from '../../../typings/reducer';
import {
    Store,
} from '../../../typings/store';

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

// action2 should have the extended unnamed type.
let action2 = store.dispatch({
    type: 'bar',
    value2: 'on',
});

action2 = 6;


