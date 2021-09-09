
interface ErrorJson {
    message: string
    stack: string
}

type Func<A extends any[], V> = (...args: A) => V

type Logger = Func<any[], void>

interface AfterEffectsResults<R = any> {
    error: ErrorJson | null,
    logs: string[][],
    result: R
}
interface AfterEffectsOptions {
    readonly handleErrors: boolean
    readonly writeResults: boolean
    readonly renderEngine: boolean
    readonly programDir: string,
    readonly logger: Logger,
    readonly shortcut: 'executeSync' | 'execute' | 'createSync' | 'create',
    readonly includes: readonly string[]
}

interface AfterEffects<A extends any[], V> extends Func<any[], V> {

    scriptsDir: string,
    executeSync: Func<A, V>,
    execute: Func<A, Promise<V>>,

    createSync: Func<A, V>,
    create: Func<A, Promise<V>>,

    options: AfterEffectsOptions
}

/*** Exports ***/

export {
    AfterEffects,
    AfterEffectsResults,
    AfterEffectsOptions,

    Logger,
    ErrorJson,
}