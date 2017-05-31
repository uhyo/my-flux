import {
    compile,
} from '../../util/typescript';

// compile henlper function
function fcompile(...filenames: Array<string>){
    return compile(... filenames.map(f=> [__dirname, '../../typing/react', f]));
}

describe('type definition of connect', ()=>{
    it('inference', async ()=>{
        const [p1] = await fcompile(
            'connect-infer.tsx',
        );

        expect(p1).compileSuccess();
    });
});
