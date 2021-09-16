import { Command, CommandConfig, Json } from './types'

/*** Main ***/

function createCommand<A extends Json[], R extends Json | void>(
    config: CommandConfig<A, R>
): Command<A, R> {

    return {
        serializeResult: true,
        prependEs5Shim: false,
        prependCustomEs3: [],
        appPath: '', // TODO: find
        ...config,
        es3: '' // TODO: transpile
    }
}

/*** Exports ***/

export default createCommand

export {
    createCommand
}