import {
    Reducer,
} from '../../../dist/typings/reducer';
import {
    Store,
} from '../../../dist/typings/store';
import {
    connect,
} from '../../../dist/typings/react/connect';

export interface Action{
    'this is action': true;
}

export interface FooState{
    value: string;
}

export const reducer: Reducer<FooState, Action> = (state = {value: ''})=>state;

export const store = new Store<FooState, Action>(reducer);

export {
    connect,
};
