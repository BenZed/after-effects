import { Command, CommandConfig, Json } from './types'
import OldCommand from './command'

/*** Main ***/

function createCommand<A extends Json[], R extends Json | void>(
    config: CommandConfig<A, R>
): Command<A, R> {

    const es3 = config.transpileToEs3
        ? new OldCommand(config.source).toString()
        : config.source.toString()

    return {
        serializeResult: true,
        prependEs5Shim: false,
        prependCustomEs3: [],
        transpileToEs3: false,
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
