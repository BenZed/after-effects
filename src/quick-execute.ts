import 'types-for-adobe/AfterEffects/2018'

import {
    ExecuteResult,
    Command,
    CommandConfig,

    Json,
    JsonFunc
} from './types'

/*** Move Me ***/

function createCommand<A extends Json[], R extends Json | void>(config: CommandConfig<A, R>): Command<A, R> {

    return {
        ...config,
        es3: '' // TODO: transpile
    }
}

function commandToIIFEStr<A extends Json[]>(command: Command<A, Json | void>, args: A): string {

    // "function(arg1, arg2){}" -> "(function(arg1, arg2){})(0, 1)"
    return `(${command.es3})(${args.map(arg => JSON.stringify(arg)).join(',')})`
}

function sendToAfterEffects<A extends Json[], R extends Json | void>(
    command: Command<A, R>,
    args: A
): ExecuteResult<R> | null {

    const iife = commandToIIFEStr(command, args)

    const result = void iife ?? null // TODO: execute me
    return result
}

/*** Main ***/

function quickExecute<A extends Json[], R extends Json | void>(
    source: JsonFunc<A, R>,
    ...args: A
): ExecuteResult<R> | null {

    const command = createCommand({
        source,
        prependEs5Shim: true,
        serializeResult: true
    })

    const result = sendToAfterEffects(command, args)
    return result
}

/*** Exports ***/

export default quickExecute