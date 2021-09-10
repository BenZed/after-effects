import { Func, Json } from '@benzed/util'

/*** Types ***/

export type JsonFunc<Arg extends Json, Result extends Json | void> = Func<[Arg], Result>

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

export interface Command<Arg extends Json, Result extends Json | void, Serialize extends boolean> {

    readonly source: JsonFunc<Arg, Result>

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
     * Should After Effects script execution results and/or errors be serialized and returned
     * to node?
     */
    readonly serializeResult: Serialize

    /**
     * Transpiled javascript function that will work in the es3 scripting environment inside After Effects
     */
    readonly es3: string

}

interface _UseCommandConfig<Arg extends Json, Result extends Json | void, Serialize extends boolean> {

    readonly command: Command<Arg, Result, Serialize>

    /**
     * Arguments that will be stringified and passed to the After Effects command when used.
     */
    readonly args: Arg

    readonly app: AppInfo
}

export interface ExecuteConfig<Arg extends Json, Result extends Json | void, Serialize extends boolean> extends _UseCommandConfig<Arg, Result, Serialize> {

    /**
     * Should the command be executed in the Render Engine or not?
     */
    readonly renderEngine: boolean

}

export interface ExecuteResult<Result extends Json | void> {

    /**
     * Any console.log statements that were used inside the Command.source function will 
     */
    readonly logs: {
        readonly info: readonly Json[],
        readonly warn: readonly Json[],
        readonly error: readonly Json[],
    }

    readonly result: Result

    readonly error: JsonError | null

}

export interface CreateScriptConfig<Arg extends Json> extends _UseCommandConfig<Arg, void, false> {

    /**
     * Target path of the file relative to the After Effect's app script folder. 
     */
    readonly scriptPath: `./${string}.jsx`
}