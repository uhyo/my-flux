import {
    compile,
} from '../util/typescript';

describe('type definiton of combineReducers', ()=>{
    it('combines reducer types', async ()=>{
        const [p] = await compile([__dirname, '../typing/reducer/combineReducers.ts']);
        expect(p).compileSuccess();
    });
    it('nicely infers return type', async ()=>{
        const [p1, p2] = await compile(
            [__dirname, '../typing/reducer/combineReducers-infer1.ts'],
            [__dirname, '../typing/reducer/combineReducers-infer2.ts'],
        );
        expect(p1).compileFails(/^Property 'baz' does not exist on type/);
        expect(p2).compileFails(`Type 'string' is not assignable to type 'number'.`);
    });
});
