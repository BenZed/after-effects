import {
    ExecuteResult,
    ExecuteConfig,

    Json,
    JsonFunc
} from './types'

import createCommand from './create-command'
import sendToAfterEffects, { sendToAfterEffectsAsync } from './send-to-after-effects'

/*** Helper ***/

function resolveExecuteConfig<A extends Json[], R extends Json | void>(
    input: JsonFunc<A, R> | ExecuteConfig<A, R>
): ExecuteConfig<A, R> {

    const config: ExecuteConfig<A, R> = typeof input === 'function'
        ? {
            source: input,
            prependEs5Shim: true,
            serializeResult: true
        }

        : input

    return config
}

/*** Main ***/

function executeSync<A extends Json[], R extends Json | void>(
    input: JsonFunc<A, R> | ExecuteConfig<A, R>,
    ...args: A
): ExecuteResult<R> | null {

    const { renderEngine = false, ...commandConfig } = resolveExecuteConfig(input)
    if (renderEngine) {
        // ensure instance of render engine is running
    }

    const command = createCommand(commandConfig)

    const result = sendToAfterEffects(command, args, renderEngine)
    return result
}

async function execute<A extends Json[], R extends Json | void>(
    source: JsonFunc<A, R> | ExecuteConfig<A, R>,
    ...args: A
): Promise<ExecuteResult<R> | null> {

    const { renderEngine = false, ...commandConfig } = resolveExecuteConfig(source)
    if (renderEngine) {
        // ensure instance of render engine is running
    }

    const command = createCommand(commandConfig)

    const result = await sendToAfterEffectsAsync(command, args, renderEngine)
    return result
}

/*** Exports ***/

export default executeSync

export {
    execute,
    executeSync
}