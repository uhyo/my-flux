import {
    combineReducers,
    Reducer,
} from '../../../dist/typings/reducer';

interface Action{}

interface FooState{
    value: string;
}
type BarState = number;

interface CombinedState{
    foo: FooState;
    bar: BarState;
}

function fooReducer(state: FooState, _action: Action): FooState{
    return state;
}
function barReducer(state: BarState, _action: Action): BarState{
    return state;
}

const reducer: Reducer<CombinedState, Action> = combineReducers({
    foo: fooReducer,
    bar: barReducer,
});
