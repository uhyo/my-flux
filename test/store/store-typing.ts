import {
    compile,
} from '../util/typescript';

describe('type definition of Store', ()=>{
    it('infers state type', async ()=>{
        const [p1, p2] = await compile(
            [__dirname, '../typing/store/store-type.ts'],
            [__dirname, '../typing/store/store-type-ill-1.ts'],
        );

        expect(p1).compileSuccess();

        expect(p2).compileFails(`Property 'vaooo' does not exist on type 'FooState'.`);
    });
    it('infers action type', async ()=>{
        const [p1, p2, p3, p4, p5, p6] = await compile(
            [__dirname, '../typing/store/dispatch-type.ts'],
            [__dirname, '../typing/store/dispatch-type-ill-1.ts'],
            [__dirname, '../typing/store/dispatch-return-type.ts'],
            [__dirname, '../typing/store/dispatch-return-type-ill-1.ts'],
            [__dirname, '../typing/store/dispatch-return-type-ill-2.ts'],
            [__dirname, '../typing/store/dispatch-return-type-ill-3.ts'],
        );

        expect(p1).compileSuccess();
        expect(p2).compileFails(`Argument of type 'IllAction' is not assignable to parameter of type 'Action'.
  Property ''this is action'' is missing in type 'IllAction'.`);
        expect(p3).compileSuccess();
        expect(p4).compileFails(`Type '"bom"' is not assignable to type '"boo"'.`);
        expect(p5).compileFails(`Type '6' is not assignable to type '{ type: "foo"; value: string; }'.`);
        expect(p6).compileFails(`Type '6' is not assignable to type '{ type: "bar"; value2: "on"; }'.`);
    });
    it('infers subscribe type', async ()=>{
        const [p1, p2] = await compile(
            [__dirname, '../typing/store/subscribe-type.ts'],
            [__dirname, '../typing/store/subscribe-type-ill-1.ts'],
        );

        expect(p1).compileSuccess();
        expect(p2).compileFails(`Property 'value2' does not exist on type 'FooState'.`);
    });
});
