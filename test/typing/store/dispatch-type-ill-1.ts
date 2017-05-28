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

interface IllAction{
    bar: number;
}

const action1: IllAction = {
    bar: 123,
};

// should cause error
store.dispatch(action1);


