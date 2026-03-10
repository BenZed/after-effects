import os from 'os'
import path from 'path'

import { JsonFunc, CreateScriptConfig } from './types'
import createCommand from './create-command'
import OldCommand from './command'
import { adobify } from './util/transpile'
import { write, writeSync } from './util/fs-util'
import { findAfterEffects, findAfterEffectsSync, AfterEffectsMissingError } from './api/common'

/*** Platform ***/

const isMac = os.platform() === 'darwin'

const PROGRAM_DIR = isMac
    ? path.resolve('/Applications')
    : path.resolve('C:/Program Files/Adobe')

const SCRIPT_SUBPATH = isMac
    ? 'Scripts'
    : 'Support Files/Scripts'

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

function buildScriptAdobified(command: ReturnType<typeof createCommand>) {
    const oldCmd = OldCommand(command.source)
    const options = { handleErrors: false, writeResults: false }
    const { adobified } = adobify(oldCmd, [], options)
    return adobified
}

function resolveScriptPath(scriptName: string, scriptsDir: string): string {
    return path.isAbsolute(scriptName)
        ? scriptName
        : path.join(scriptsDir, scriptName)
}

/*** Main ***/

function createScriptSync(
    ...input: [source: JsonFunc<[], void>, scriptName: string] | [config: CreateScriptConfig]
): void {

    const { scriptName, ...commandConfig } = resolveCreateScriptConfig(input)

    const command = createCommand(commandConfig)
    const adobified = buildScriptAdobified(command)

    const programDir = command.appPath || PROGRAM_DIR
    const aeUrl = findAfterEffectsSync(programDir, isMac)
    if (!aeUrl)
        throw new AfterEffectsMissingError()

    const aeDir = path.dirname(aeUrl)
    const scriptsDir = path.join(aeDir, SCRIPT_SUBPATH)
    const jsxUrl = resolveScriptPath(scriptName, scriptsDir)

    writeSync(jsxUrl, adobified)
}

async function createScript(
    ...input: [source: JsonFunc<[], void>, scriptName: string] | [config: CreateScriptConfig]
): Promise<void> {

    const { scriptName, ...commandConfig } = resolveCreateScriptConfig(input)

    const command = createCommand(commandConfig)
    const adobified = buildScriptAdobified(command)

    const programDir = command.appPath || PROGRAM_DIR
    const aeUrl = await findAfterEffects(programDir, isMac)
    if (!aeUrl)
        throw new AfterEffectsMissingError()

    const aeDir = path.dirname(aeUrl)
    const scriptsDir = path.join(aeDir, SCRIPT_SUBPATH)
    const jsxUrl = resolveScriptPath(scriptName, scriptsDir)

    await write(jsxUrl, adobified)
}

/*** Exports ***/

export {
    createScript,
    createScriptSync
}
