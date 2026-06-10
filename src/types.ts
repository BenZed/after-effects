/*** Types ***/

type Json = string | number | boolean | null | readonly Json[] | { readonly [key: string]: Json }

type Func<A extends any[], R> = (...args: A) => R

export type JsonFunc<A extends Json[], R extends Json | void> = Func<A, R>

export interface JsonError {
    readonly message: string
    readonly stack: string
    readonly name: string
}


export interface ScriptConfig<A extends Json[], R extends Json | void, S extends boolean = boolean> {

    readonly source: JsonFunc<A, R>

    /**
     * Should After Effects script execution results and/or errors be serialized and returned
     * to node?
     */
    readonly serializeResult?: S

    /**
     * Prepend an es5 shim to the es3 environment inside After Effects, allowing the source
     * method to use newer javascript methods.
     */
    readonly prependEs5Shim?: boolean

    /**
     * Preprend arbitrary es3 code for edge cases.
     */
    readonly prependCustomEs3?: string[]

    /**
     * Where the After Effects application to use for this command is installed.
     */
    readonly appPath?: string

    /**
     * Transpile the source to ES3 for use in the legacy ExtendScript environment.
     * Defaults to true. Set false to pass modern JS through untouched (UXP).
     * Will default to false in the next major version once UXP is standard.
     */
    readonly transpileToEs3?: boolean
}


export type CreateScriptConfig = ScriptConfig<[], void, false> & {

    /**
     * Target path of the file relative to the After Effect's app script folder. 
     */
    readonly scriptName: string
}

export type ExecuteConfig<A extends Json[], R extends Json | void> = ScriptConfig<A, R, boolean> & {

    /**
     * Should the command be executed in the Render Engine or not?
     */
    readonly renderEngine?: boolean
}

export interface ExecuteResult<R extends Json | void> {

    /**
     * Arguments of any console.log statements made inside the source function,
     * one entry per call. Script errors are not returned here; they are thrown
     * as AfterEffectsScriptError.
     */
    readonly logs: readonly Json[][]

    readonly result: R

}

// Types needed by api/ modules

export type Logger = (...args: any[]) => void

/** Shape of errors serialized out of the AE scripting environment */
export type ErrorJson = JsonError

/** Shape of the results file written from inside After Effects */
export interface AfterEffectsResults {
    error: ErrorJson | null
    logs: Json[][]
    result: any
}

export {
    Json,
    Func
}