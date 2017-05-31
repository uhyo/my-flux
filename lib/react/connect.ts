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

export interface Selector<State, OriginalProps, ResultProps>{
    (state: State, props: OriginalProps): ResultProps;
}
export interface Dispatcher<Action>{
    <A extends Action>(action: A): Action;
}

export interface ComponentConnectFunction<AddedProps extends object>{
    <OriginalProps extends object, State>(component: ComponentClass<OriginalProps & AddedProps, State>): ComponentClass<OriginalProps, AddedProps>;
}
export function connect<State, Action, OriginalProps extends object, AddedByStateProps extends object, AddedByDispatchProps extends object>(
    store: Store<State, Action>,
    mapStateToProps: Selector<State, OriginalProps, AddedByStateProps>,
    mapDispatchToProps?: Selector<Dispatcher<Action>, OriginalProps, AddedByDispatchProps>,
): ComponentConnectFunction<AddedByStateProps & AddedByDispatchProps>{
    type AddedProps = AddedByStateProps & AddedByDispatchProps;
    return <WrappedState>(component: ComponentClass<OriginalProps & AddedProps, WrappedState>)=>{
        return class extends Component<OriginalProps, AddedProps>{
            protected unsubscribe: undefined | (()=>void);
            constructor(props: OriginalProps){
                super(props);

                // 現在のstateを取得
                const bystate = mapStateToProps(store.getState(), props);
                const bydispatch = (mapDispatchToProps ? mapDispatchToProps(store.dispatch, props) : {}) as AddedByDispatchProps;
                // FIXME
                const added = {
                    ... (bystate as any),
                    ... (bydispatch as any),
                } as Readonly<AddedProps>;

                this.state = added;
                this.unsubscribe = store.subscribe(state=>{
                    const newState = mapStateToProps(state, props);
                    this.setState(newState);
                });
            }
            componentWillUnmount(){
                /* istanbul ignore else */
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
