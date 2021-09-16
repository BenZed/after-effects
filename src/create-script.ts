
import { JsonFunc, CreateScriptConfig } from './types'
import createCommand from './create-command'

/*** Helper ***/

function resolveCreateScriptConfig(
    input: [source: JsonFunc<[], void>, scriptName: string] | [config: CreateScriptConfig]
): CreateScriptConfig {

    if (input.length === 1) {
        const [config] = input
        return config
    }

    const [source, scriptName] = input

    const config: CreateScriptConfig = {
        source,
        prependEs5Shim: true,
        serializeResult: false,
        scriptName
    }

    return config
}

/*** Main ***/

function createScriptSync(
    ...input: [source: JsonFunc<[], void>, scriptName: string] | [config: CreateScriptConfig]
): void {

    const { scriptName, ...commandConfig } = resolveCreateScriptConfig(input)

    const command = createCommand(commandConfig)

    // TODO writeCommandToScriptsFolder(command)

}

async function createScript(
    ...input: [source: JsonFunc<[], void>, scriptName: string] | [config: CreateScriptConfig]
): Promise<void> {

    // TODO 
}

/*** Exports ***/

export {
    createScript,
    createScriptSync
}