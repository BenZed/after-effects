import { Func, Json } from '@benzed/util'

/*** Types ***/

export type JsonFunc<A extends Json[], R extends Json | void> = Func<A, R>

export interface JsonError {
    readonly message: string
    readonly stack: string
    readonly name: string
}

export interface AppInfo {

    /**
     * Where the After Effects application is installed.
     */
    readonly path: string

    /**
     * Script directory for the corresponding After Effects installation.
     */
    readonly scriptDir: string

}

type PrependCommand<T> = T extends Command<infer A, void, false>
    ? Command<A, void, false> & { args: A }
    : never

export interface Command<A extends Json[], R extends Json | void, S extends boolean = boolean> {

    readonly source: JsonFunc<A, R>

    /**
     * Prepend an es5 shim to the es3 environment inside After Effects, allowing the source
     * method to use newer javascript methods.
     */
    readonly prependEs5Shim?: boolean

    /**
     * Preprend arbitrary es3 code for edge cases.
     */
    readonly prependCustomEs3?: (PrependCommand<Json[]> | string)[]

    /**
     * Should After Effects script execution results and/or errors be serialized and returned
     * to node?
     */
    readonly serializeResult: S

    /**
     * Transpiled javascript function that will work in the es3 scripting environment inside After Effects
     */
    readonly es3: string

}

export type CommandConfig<A extends Json[], R extends Json | void, S extends boolean = boolean> = Omit<Command<A, R, S>, 'es3'>

interface _UseCommandConfig<A extends Json[], R extends Json | void, S extends boolean> {

    readonly command: Command<A, R, S>

    /**
     * Arguments that will be stringified and passed to the After Effects command when used.
     */
    readonly args: A

    readonly app: AppInfo
}

export interface ExecuteConfig<A extends Json[], R extends Json | void> extends _UseCommandConfig<A, R, boolean> {

    /**
     * Should the command be executed in the Render Engine or not?
     */
    readonly renderEngine: boolean

}

export interface ExecuteResult<R extends Json | void> {

    /**
     * Any console.log statements that were used inside the Command.source function will 
     */
    readonly logs: {
        readonly info: readonly Json[],
        readonly warn: readonly Json[],
        readonly error: readonly Json[],
    }

    readonly result: R

    readonly error: JsonError | null

}

export interface CreateScriptConfig<A extends Json[]> extends _UseCommandConfig<A, void, false> {

    /**
     * Target path of the file relative to the After Effect's app script folder. 
     */
    readonly scriptPath: `./${string}.jsx`
}

export {
    Json
}