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

const store = new Store(fooReducer);

interface Action2 extends Action{
    value: 'boo';
}

const action: Action2 = {
    'this is action': true,
    value: 'boo',
};

// action2 should have type 'Action2'
const action2 = store.dispatch(action);

action2.value = 'bom';
