// TypeScript compilation for testing
import * as path from 'path';
import * as ts from 'typescript';

export interface CompileResult{
    filename: string;
    success: boolean;
    diagnostics: Array<ts.Diagnostic>;
}

// compile関係のextension
expect.extend({
    compileSuccess(result: CompileResult){
        const {
            filename,
            success,
            diagnostics,
        } = result;
        const message =
            success ?
            ()=> `${this.utils.matcherHint('.not.compileSuccess', `compile(${filename})`, '')}

Expected file to not compile, but it successfully compiled.`
            : ()=> `${this.utils.matcherHint('.compileSuccess', `compile(${filename})`, '')}

Expected file to compile, but errors occurred:

` + diagnostics.map(({
    code,
    messageText,
})=> `${code} : ${messageText}`).join('\n');
        return {
            pass: success,
            message,
        };
    },
    compileFails(result: CompileResult, expectedMessage: string | RegExp | ((mes: string)=>boolean)){
        const {
            filename,
            success,
            diagnostics,
        } = result;
        const chk = (mes: string)=>{
            if ('string' === typeof expectedMessage){
                return mes === expectedMessage;
            }
            if (expectedMessage instanceof RegExp){
                return expectedMessage.test(mes);
            }
            return expectedMessage(mes);
        };
        const pass = !success && diagnostics.length === 1 && chk(diagnostics[0].messageText as string);
        const message =
            pass ?
            ()=> `${this.utils.matcherHint('.not.compileFails', `compile(${filename})`, 'string' === typeof expectedMessage ? expectedMessage : '')}

Expected file not to compile with the specified error, but it did not. The following ${this.utils.pluralize('error', diagnostics.length)} occurred:

` + diagnostics.map(({
    code,
    messageText,
})=> `${code} : ${messageText}`).join('\n')

            : ()=> `${this.utils.matcherHint('.compileFails', `compile(${filename})`, 'string' === typeof expectedMessage ? expectedMessage : '')}

Expected file to cause the specified error, but it did not. The following ${this.utils.pluralize('error', diagnostics.length)} occurred:

` + diagnostics.map(({
    code,
    messageText,
})=> `${code} : ${messageText}`).join('\n');
        return {
            pass,
            message,
        };
            
    },
});


export function compile(...paths: Array<string>): Promise<CompileResult>{
    const filename = path.resolve(...paths);
    return new Promise<CompileResult>((resolve, reject)=>{
        const program = ts.createProgram([filename], {
            noEmitOnError: true,
            noImplicitAny: true,
        });

        const diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.length > 0){
            resolve({
                success: false,
                filename,
                diagnostics,
            });
        }else{
            resolve({
                success: true,
                filename,
                diagnostics,
            });
        }
        resolve();
    });
}
