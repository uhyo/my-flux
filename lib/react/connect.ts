import {
    Component,
    createElement,
} from 'react';
import {
    Store,
} from '../store';

export interface ComponentClass<P, S>{
    new(props: P): Component<P, S>;
}

export interface Selector<S, T>{
    (state: S): T;
}
export interface ComponentConnectFunction<AddedProps extends object>{
    <OriginalProps extends object, State>(component: ComponentClass<OriginalProps & AddedProps, State>): ComponentClass<OriginalProps, AddedProps>;
}
export function connect<State, Action, AddedProps extends object>(
    store: Store<State, Action>,
    mapStateToProps: Selector<State, AddedProps>,
): ComponentConnectFunction<AddedProps>{
    return <OriginalProps extends object, State>(component: ComponentClass<OriginalProps & AddedProps, State>)=>{
        return class extends Component<OriginalProps, AddedProps>{
            protected unsubscribe: undefined | (()=>void);
            constructor(props: OriginalProps){
                super(props);

                // 現在のstateを取得
                const added = mapStateToProps(store.getState());

                this.state = added;
                this.unsubscribe = store.subscribe(state=>{
                    const newState = mapStateToProps(state);
                    this.setState(newState);
                });
            }
            componentWillUnmount(){
                if (this.unsubscribe != null){
                    this.unsubscribe();
                    this.unsubscribe = void 0;
                }
            }
            render(){
                // FIXME
                const {
                    children,
                    ... props2,
                } = (this.props as any);
                const props = {
                    ... props2,
                    ... (this.state as any),
                } as OriginalProps & AddedProps;
                return createElement(component, props, children);
            }
        };
    };
}
