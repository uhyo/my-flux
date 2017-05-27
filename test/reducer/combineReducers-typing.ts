import {
    compile,
} from '../util/typescript';

describe('type definiton of combineReducers', ()=>{
    it('combines reducer types', async ()=>{
        const p = await compile(__dirname, '../typing/reducer/combineReducers.ts');
        expect(p).compileSuccess();
    });
    it('nicely infers keys of return type', async ()=>{
        const p = await compile(__dirname, '../typing/reducer/combineReducers-infer1.ts');
        expect(p).compileFails(/^Property 'baz' does not exist on type/);
    });
    it('nicely infers values of return type', async ()=>{
        const p = await compile(__dirname, '../typing/reducer/combineReducers-infer2.ts');
        // expect(p).compileSuccess();
        expect(p).compileFails(`Type 'string' is not assignable to type 'number'.`);
    });
});
