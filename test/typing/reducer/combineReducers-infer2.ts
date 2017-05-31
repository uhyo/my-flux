import {
    combineReducers,
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

// fooReducer: Reducer<FooState, Action>
function fooReducer(state: FooState, _action: Action): FooState{
    return state;
}
// barReducer: Reducer<FooState, Action>
function barReducer(state: BarState, _action: Action): BarState{
    return state;
}

// reducer should be of type Reducer<CombinedState, Action>
const reducer = combineReducers({
    foo: fooReducer,
    bar: barReducer,
});

const initState: CombinedState = {
    foo: {
        value: '',
    },
    bar: 3,
};

// st should be of type CombinedState
const st = reducer(initState, {});

const stringValue: string = 'foo';
st.foo.value = stringValue;
st.bar = stringValue; // this line should cause error

