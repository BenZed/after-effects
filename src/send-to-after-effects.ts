import { Json, Command, ExecuteResult } from './types'

/*** Helper ***/

function commandToIIFEStr<A extends Json[]>(command: Command<A, Json | void>, args: A): string {

    // "function(arg1, arg2){}" -> "(function(arg1, arg2){})(0, 1)"
    return `(${command.es3})(${args.map(arg => JSON.stringify(arg)).join(',')})`
}

/*** Main ***/

function sendToAfterEffects<A extends Json[], R extends Json | void>(
    command: Command<A, R>,
    args: A
): ExecuteResult<R> | null {

    const iife = commandToIIFEStr(command, args)

    const result = void iife ?? null // TODO: execute me
    return result
}

/*** Exports ***/

export default sendToAfterEffects