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

});
