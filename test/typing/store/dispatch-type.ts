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

const store = new Store(fooReducer);

// action should have type 'Action'
const action = store.dispatch({
    'this is action': true,
});


action['this is action'] = true;

