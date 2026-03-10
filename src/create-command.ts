import { Command, CommandConfig, Json } from './types'
import toEs3Script from './command'

/*** Cache ***/

const es3Cache = new Map<string, string>()

function getEs3(source: string, transpile: boolean): string {
    const key = `${transpile}:${source}`
    if (!es3Cache.has(key))
        es3Cache.set(key, transpile ? toEs3Script(source).code[1] ?? '' : source)

    return es3Cache.get(key)!
}

/*** Main ***/

function createCommand<A extends Json[], R extends Json | void>(
    config: CommandConfig<A, R>
): Command<A, R> {

    const es3 = getEs3(config.source.toString(), config.transpileToEs3 ?? true)

    return {
        serializeResult: true,
        prependEs5Shim: false,
        prependCustomEs3: [],
        transpileToEs3: true,
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
