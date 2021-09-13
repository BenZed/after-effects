import { CommandConfig } from '.'
import {
    ExecuteResult,
    Command,

    Json,
    JsonFunc
} from './types'

/*** Move Me ***/

function createCommand<A extends Json[], R extends Json>(config: CommandConfig<A, R>): Command<A, R> {

    return {
        ...config,
        es3: '' // TODO: transpile
    }

}

function commandToIIFEStr<A extends Json[]>(command: Command<A, Json | void>, args: A): string {
    return `(${command.es3})(${args.map(arg => JSON.stringify(arg)).join(',')})`
}

function sendToAfterEffects<A extends Json[], R extends Json>(
    command: Command<A, R>,
    args: A
): ExecuteResult<R> | null {

    const iife = commandToIIFEStr(command, args)

    const result = void iife ?? null // TODO: execute me
    return result
}

/*** Main ***/

function quickExecute<A extends Json[], R extends Json>(
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