// Extension to jest type definitions

declare namespace jest{
    interface Matchers{
        resolves: Matchers;
        rejects: Matchers;
        // custom
        compileSuccess(): void;
        compileFails(message: string | RegExp | ((mes: string)=>boolean)): void;
    }
}
