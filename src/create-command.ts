import { Command, CommandConfig, Json } from './types'
import OldCommand from './command'

/*** Main ***/

function createCommand<A extends Json[], R extends Json | void>(
    config: CommandConfig<A, R>
): Command<A, R> {

    // Use the Command class to handle source-to-ES3 transpilation,
    // including isFunctionExpression detection and babel prefix stripping.
    const es3 = new OldCommand(config.source).toString()

    return {
        serializeResult: true,
        prependEs5Shim: false,
        prependCustomEs3: [],
        appPath: '',
        ...config,
        es3
    }
}

/*** Exports ***/

export default createCommand

export {
    createCommand
}
