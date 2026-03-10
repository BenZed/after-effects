import os from 'os'
import path from 'path'

import { JsonFunc, CreateScriptConfig } from './types'
import toEs3Script from './to-es3-script'
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

function buildScriptAdobified(config: CreateScriptConfig) {
    const scriptCmd = toEs3Script(config.source)
    const options = { handleErrors: false, writeResults: false }
    const { adobified } = adobify(scriptCmd, [], options)
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

    const config = resolveCreateScriptConfig(input)
    const adobified = buildScriptAdobified(config)

    const programDir = config.appPath || PROGRAM_DIR
    const aeUrl = findAfterEffectsSync(programDir, isMac)
    if (!aeUrl)
        throw new AfterEffectsMissingError()

    const aeDir = path.dirname(aeUrl)
    const scriptsDir = path.join(aeDir, SCRIPT_SUBPATH)
    const jsxUrl = resolveScriptPath(config.scriptName, scriptsDir)

    writeSync(jsxUrl, adobified)
}

async function createScript(
    ...input: [source: JsonFunc<[], void>, scriptName: string] | [config: CreateScriptConfig]
): Promise<void> {

    const config = resolveCreateScriptConfig(input)
    const adobified = buildScriptAdobified(config)

    const programDir = config.appPath || PROGRAM_DIR
    const aeUrl = await findAfterEffects(programDir, isMac)
    if (!aeUrl)
        throw new AfterEffectsMissingError()

    const aeDir = path.dirname(aeUrl)
    const scriptsDir = path.join(aeDir, SCRIPT_SUBPATH)
    const jsxUrl = resolveScriptPath(config.scriptName, scriptsDir)

    await write(jsxUrl, adobified)
}

/*** Exports ***/

export {
    createScript,
    createScriptSync
}
