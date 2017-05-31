import * as React from 'react';
import {
    Action,
    store,
    connect,
    FooState,
} from './base';

interface IPropComponent{
    foo: string;
    bar: string;
}
class C extends React.Component<IPropComponent, {}>{
    render(){
        const {
            foo,
            bar,
        } = this.props;
        return <div>
            <p>foo: {foo}</p>
            <p>bar: {bar}</p>
        </div>;
    }
}

const Container = connect(
    store,
    ({value}: FooState)=>({foo: value}),
)(C);

const component = <Container bar="bar" />;

component;
