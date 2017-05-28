import {
    Reducer,
} from '../../lib/reducer';
import {
    Store,
} from '../../lib/store';

describe('store', ()=>{
    type FooState = string;
    interface BarState{
        value: number;
    }
    interface Action{
        type: string;
        value: string;
    }
    const fooReducer = (state: FooState = '', action: Action)=>{
        if (action.type === 'foo'){
            return action.value;
        }
        return state;
    };
    const barReducer = (state: BarState = {value: 0}, action: Action)=>{
        if (action.type === 'bar'){
            return {
                value: parseInt(action.value),
            };
        }
        return state;
    };

    describe('dispatch & getState', ()=>{
        it('can dispatch and getState', ()=>{
            const store = new Store(fooReducer);

            store.dispatch({
                type: 'foo',
                value: 'FOOOOOO',
            });
            expect(store.getState()).toEqual('FOOOOOO');
        });
        it('getState is bound', ()=>{
            const store = new Store(fooReducer);

            store.dispatch({
                type: 'foo',
                value: 'BOOM',
            });
            const g = store.getState;
            expect(g()).toEqual('BOOM');
        });
        it('dispatch is bound', ()=>{
            const store = new Store(fooReducer);
            const d = store.dispatch;

            d({
                type: 'foo',
                value: '風呂',
            });
            expect(store.getState()).toEqual('風呂');
        });
        it('getState() throws before initialized', ()=>{
            const store = new Store(fooReducer);

            expect(()=>{
                store.getState();
            }).toThrow('Store is not initialized');
        });
        it('can handle state initializer', ()=>{
            const initState = {
                value: 5,
            };
            const store = new Store(barReducer, initState);
            expect(store.getState()).toBe(initState);
        });
        it('dispatch() calls reducer', ()=>{
            const barMock: Reducer<BarState, Action> = jest.fn(barReducer);
            const store = new Store(barMock);

            const action = {
                type: 'bar',
                value: '5',
            };
            expect(barMock).not.toHaveBeenCalled();

            store.dispatch(action);
            expect(barMock).toHaveBeenCalledWith(void 0, action);

            const action2 = {
                type: 'foo',
                value: 'BOO',
            };

            store.dispatch(action2);
            expect(barMock).toHaveBeenLastCalledWith({
                value: 5,
            }, action2);
        });
    });
    
    describe('subscribe', ()=>{
        it('can listen', ()=>{
            const store = new Store(barReducer);
            const listener = jest.fn();
            store.subscribe(listener);

            expect(listener).not.toHaveBeenCalled();

            store.dispatch({
                type: 'bar',
                value: '100',
            });

            expect(listener).toHaveBeenLastCalledWith({
                value: 100,
            });
        });
        it('callback is called in registered order', ()=>{
            const store = new Store(fooReducer);
            const memo: Array<[number, string]> = [];
            const listener1 = jest.fn(value=> memo.push([1, value]));
            const listener2 = jest.fn(value=> memo.push([2, value]));
            const listener3 = jest.fn(value=> memo.push([3, value]));

            store.subscribe(listener1);
            store.subscribe(listener2);
            store.subscribe(listener3);

            store.dispatch({
                type: 'foo',
                value: 'BOOM',
            });

            expect(memo).toEqual([
                [1, 'BOOM'],
                [2, 'BOOM'],
                [3, 'BOOM'],
            ]);
        });
        it('subscription can be unsubscribed', ()=>{
            const store = new Store(fooReducer);

            const listener = jest.fn();

            const u = store.subscribe(listener);

            u();

            store.dispatch({
                type: 'foo',
                value: '👀',
            });

            expect(listener).not.toHaveBeenCalled();
        });
        it('multiple unsubscribe is no-op', ()=>{
            const store = new Store(fooReducer);

            const listener = jest.fn();

            const u = store.subscribe(listener);

            u();

            u();
            store.dispatch({
                type: 'foo',
                value: '👀',
            });

            u();

            expect(listener).not.toHaveBeenCalled();
        });
    });
});
