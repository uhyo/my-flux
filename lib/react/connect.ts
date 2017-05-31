import {
    Component,
    ComponentClass,
    StatelessComponent,
    createElement,
} from 'react';
import {
    Store,
} from '../store';

export interface Selector<State, OriginalProps, ResultProps>{
    (state: State, props: OriginalProps): ResultProps;
}
export interface Dispatcher<Action>{
    <A extends Action>(action: A): Action;
}

export interface ComponentConnectFunction<OriginalProps, AddedProps extends object>{
    (component: ComponentClass<OriginalProps & AddedProps> | StatelessComponent<OriginalProps & AddedProps>): ComponentClass<OriginalProps>;
}
export function connect<State, Action, OriginalProps extends object, AddedByStateProps extends object, AddedByDispatchProps extends object = {}>(
    store: Store<State, Action>,
    mapStateToProps: Selector<State, OriginalProps, AddedByStateProps>,
    mapDispatchToProps?: Selector<Dispatcher<Action>, OriginalProps, AddedByDispatchProps>,
): ComponentConnectFunction<OriginalProps, AddedByStateProps & AddedByDispatchProps>{
    type AddedProps = AddedByStateProps & AddedByDispatchProps;
    return (component: ComponentClass<OriginalProps & AddedProps> | StatelessComponent<OriginalProps & AddedProps>)=>{
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
                // FIXME
                return createElement(component as any, props, children);
            }
        };
    };
}
