import {
    Reducer,
} from './reducer';

export {
    Reducer,
};

export type ReducersDict<K extends string, D extends Record<K, any>, A> = {
    [name in K]: Reducer<D[name], A>;
};
/**
 * Combines reducers.
 * @param dict a dictionary of reducers.
 * @returns combined reducer.
 */
export function combineReducers<K extends string, D extends Record<K, any>, A>(dict: ReducersDict<K, D, A>): Reducer<D, A>{
    const keys = Object.keys(dict) as Array<K>;
    return (state: D, action: A)=>{
        const result: any = {};
        for (const key of keys){
            result[key] = dict[key](state[key], action);
        }
        return result as D;
    };
}
