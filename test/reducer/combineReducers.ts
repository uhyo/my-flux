import {
    Reducer,
    combineReducers,
} from '../../lib/reducer';

describe('combineReducers', ()=>{
    interface Action{
        type: 'foo' | 'bar' | 'baz';
        value: string;
    };
    /*
    interface State{
        foo: string;
        bar: string;
        baz: string;
    }
    */
    const fooReducer: Reducer<string, Action> = (state: string, action: Action)=>{
        if (action.type === 'foo'){
            return action.value;
        }else{
            return state;
        }
    };
    const barReducer: Reducer<string, Action> = (state: string, action: Action)=>{
        if (action.type === 'bar'){
            return action.value;
        }else{
            return state;
        }
    };
    const bazReducer: Reducer<string, Action> = (state: string, action: Action)=>{
        if (action.type === 'baz'){
            return action.value;
        }else{
            return state;
        }
    };

    it('can compose dictionary of reducers', ()=>{
        const reducer = combineReducers({
            foo: fooReducer,
            bar: barReducer,
            baz: bazReducer,
        });
        const initialState = {
            foo: '',
            bar: '',
            baz: '',
        };

        const state1 = reducer(initialState, {
            type: 'foo',
            value: 'Happy!',
        });
        expect(state1).toEqual({
            foo: 'Happy!',
            bar: '',
            baz: '',
        });

        const state2 = reducer(state1, {
            type: 'bar',
            value: 'spain bar',
        });
        expect(state2).toEqual({
            foo: 'Happy!',
            bar: 'spain bar',
            baz: '',
        });

        const state3 = reducer(state2, {
            type: 'baz',
            value: '吉野家',
        });
        expect(state3).toEqual({
            foo: 'Happy!',
            bar: 'spain bar',
            baz: '吉野家',
        });
    });

    it('does not mutate input object', ()=>{
        const reducer = combineReducers({
            foo: fooReducer,
            bar: barReducer,
            baz: bazReducer,
        });

        const initialState = {
            foo: 'FOO',
            bar: 'BAR',
            baz: 'BAZ',
        };

        reducer(initialState, {
            type: 'foo',
            value: 'FOOOOOOO',
        });

        expect(initialState).toEqual({
            foo: 'FOO',
            bar: 'BAR',
            baz: 'BAZ',
        });
    });

    it('calls subreducers every time', ()=>{
        const fooMock = jest.fn(fooReducer);
        const barMock = jest.fn(barReducer);
        const bazMock = jest.fn(bazReducer);

        const reducer = combineReducers({
            foo: fooMock,
            bar: barMock,
            baz: bazMock,
        });

        const initialState = {
            foo: '',
            bar: '',
            baz: '',
        };

        const action1 = {
            type: 'foo',
            value: 'foom',
        };
        const action2 = {
            type: 'bar',
            value: 'bang',
        };
        const action3 = {
            type: 'baz',
            value: 'ば',
        };

        const state1 = reducer(initialState, action1);
        const state2 = reducer(state1, action2);
        reducer(state2, action3);

        expect(fooMock.mock.calls).toEqual([
            ['', action1],
            ['foom', action2],
            ['foom', action3],
        ]);
        expect(fooMock.mock.calls[0][1]).toBe(action1);
        expect(fooMock.mock.calls[1][1]).toBe(action2);
        expect(fooMock.mock.calls[2][1]).toBe(action3);

        expect(barMock.mock.calls).toEqual([
            ['', action1],
            ['', action2],
            ['bang', action3],
        ]);
        expect(bazMock.mock.calls).toEqual([
            ['', action1],
            ['', action2],
            ['', action3],
        ]);
    });
});
