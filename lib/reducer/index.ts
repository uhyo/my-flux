import {
    Reducer,
} from './reducer';

export {
    Reducer,
};

export type ReducersDict<D, A> = {
    [name in keyof D]: Reducer<D[name], A>;
};
/**
 * Combines reducers.
 * @param dict a dictionary of reducers.
 * @returns combined reducer.
 */
export function combineReducers<D, A>(dict: ReducersDict<D, A>): Reducer<D, A>{
    const keys = Object.keys(dict) as Array<keyof D>;
    return (state: D, action: A)=>{
        const result: any = {};
        for (const key of keys){
            result[key] = dict[key](state[key], action);
        }
        return result as D;
    };
}
