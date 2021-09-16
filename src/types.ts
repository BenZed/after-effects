import { Func, Json } from '@benzed/util'

/*** Types ***/

export type JsonFunc<A extends Json[], R extends Json | void> = Func<A, R>

export interface JsonError {
    readonly message: string
    readonly stack: string
    readonly name: string
}


type PrependCommand<T> = T extends Command<infer A, void, false>
    ? Command<A, void, false> & (A extends [] ? {} : { readonly args: A })
    //                           ^ with args
    : never

export interface CommandConfig<A extends Json[], R extends Json | void, S extends boolean = boolean> {

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
    readonly prependCustomEs3?: (PrependCommand<Json[]> | string)[]

    /**
     * Where the After Effects application to use for this command is installed.
     */
    readonly appPath?: string
}

export interface Command<A extends Json[], R extends Json | void, S extends boolean = boolean> extends Required<CommandConfig<A, R, S>> {

    /**
     * Transpiled javascript function that will work in the es3 scripting environment inside After Effects
     */
    readonly es3: string
}


export type CreateScriptConfig = CommandConfig<[], void, false> & {

    /**
     * Target path of the file relative to the After Effect's app script folder. 
     */
    readonly scriptName: string
}

export type ExecuteConfig<A extends Json[], R extends Json | void> = CommandConfig<A, R, boolean> & {

    /**
     * Should the command be executed in the Render Engine or not?
     */
    readonly renderEngine?: boolean
}

export interface ExecuteResult<R extends Json | void> {

    /**
     * Any console.log statements that were used inside the Command.source function will 
     */
    readonly logs: {
        readonly info: readonly Json[],
        readonly warn: readonly Json[],
        readonly error: readonly Json[]
    }

    readonly result: R

    readonly error: JsonError | null

}

export {
    Json,
    Func
}