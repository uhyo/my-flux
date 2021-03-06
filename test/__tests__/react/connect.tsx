import * as React from 'react';
import {
    create,
} from 'react-test-renderer';
import {
    Reducer,
} from '../../../lib/reducer';
import {
    Store,
} from '../../../lib/store';
import {
    connect,
} from '../../../lib/react/connect';
describe('connect', ()=>{
    interface Action{
        foo: string;
        bar: number;
    }
    interface State{
        foo: string;
        bar: number;
    }
    interface ComponentProps{
        hey: string;
    }
    interface DispProps{
        disp: number;
        handleClick(): void;
    }

    class C extends React.Component<ComponentProps & State, {}>{
        render(){
            const {
                foo,
                bar,
                hey,
            } = this.props;
            return <div>
                <p>foo: {foo}</p>
                <p>bar: {bar}</p>
                <p>hey: {hey}</p>
            </div>;
        }
    }
    class C2 extends React.Component<ComponentProps & State & DispProps, {}>{
        render(){
            const {
                disp,
                handleClick,
                ... others,
            } = this.props;
            return <div onClick={handleClick}>
                <p>disp: {disp * 10}</p>
                <C {...others} />
            </div>;
        }
    }


    const reducer: Reducer<State, Action> = (_, action)=>{
        return {
            foo: action.foo,
            bar: action.bar,
        };
    };
    const identity = (state: State)=>state;

    it('basic', ()=>{
        const store = new Store(reducer);
        store.dispatch({
            foo: 'FOO',
            bar: 0,
        });

        const Container = connect(
            store,
            identity,
        )(C);

        const component = create(<Container hey="Hey!" />);

        const rendered = component.toJSON();
        expect(rendered).toMatchSnapshot();
    });
    it('basic with dispatchToProps', ()=>{
        const store = new Store(reducer, {
            foo: 'FOO',
            bar: 0,
        });

        const Container = connect(
            store,
            identity,
            (dispatch)=>({
                disp: dispatch.length,
                handleClick(){},
            }),
        )(C2);

        const component = create(<Container hey="Hooy!" />);

        expect(component.toJSON()).toMatchSnapshot();
    });
    it('dispatch is connected to store', ()=>{
        const store = new Store(reducer, {
            foo: 'FOO',
            bar: 0,
        });

        const Container = connect(
            store,
            identity,
            (dispatch)=>({
                disp: dispatch.length,
                handleClick(){
                    dispatch({
                        foo: 'Foooo',
                        bar: 100,
                    });
                },
            }),
        )(C2);

        const component = create(<Container hey="Hooy!" />);
        const rendered = component.toJSON();

        expect(rendered).toMatchSnapshot();

        (rendered.props as any).onClick();

        expect(component.toJSON()).toMatchSnapshot();
    });
    it('reacts to state change', ()=>{
        const store = new Store(reducer);
        store.dispatch({
            foo: 'FOO',
            bar: 0,
        });

        const Container = connect(
            store,
            identity,
        )(C);
        const component = create(<Container hey="Hey!" />);

        expect(component.toJSON()).toMatchSnapshot();

        store.dispatch({
            foo: '風呂',
            bar: 123,
        });

        expect(component.toJSON()).toMatchSnapshot();
    });
    it('calls selector when store changed', ()=>{
        const store = new Store(reducer, {
            foo: 'FOO',
            bar: 0,
        });

        const selector: typeof identity = jest.fn(identity);
        const Container = connect(
            store,
            selector,
        )(C);

        expect(selector).not.toHaveBeenCalled();

        create(<Container hey="Hoy!" />);

        expect((selector as any).mock.calls).toEqual([
            [{
                foo: 'FOO',
                bar: 0,
            }, {
                hey: 'Hoy!',
            }],
        ]);

        store.dispatch({
            foo: 'BOO',
            bar: -5,
        });

        expect((selector as any).mock.calls).toEqual([
            [{
                foo: 'FOO',
                bar: 0,
            }, {
                hey: 'Hoy!',
            }],
            [{
                foo: 'BOO',
                bar: -5,
            }, {
                hey: 'Hoy!',
            }],
        ]);
    });
    it('unmounting', ()=>{
        const store = new Store(reducer, {
            foo: 'FOO',
            bar: 0,
        });

        const selector: typeof identity = jest.fn(identity);
        const Container = connect(
            store,
            selector,
        )(C);

        expect(selector).not.toHaveBeenCalled();

        const component = create(<Container hey="Hoy!" />);

        component.unmount();

        store.dispatch({
            foo: 'BOO',
            bar: -5,
        });

        expect((selector as any).mock.calls).toEqual([
            [{
                foo: 'FOO',
                bar: 0,
            }, {
                hey: 'Hoy!',
            }],
        ]);
    });
});
