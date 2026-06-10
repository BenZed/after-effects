import os from 'os'
import path from 'path'

import { Json, ScriptConfig, ExecuteResult, AfterEffectsResults } from './types'
import buildAdobified from './build-adobified'
import { findAfterEffectsSync, findAfterEffects, AfterEffectsMissingError } from './api/common'
import { launchMacSync, launchMac } from './api/launch-mac'
import { launchWinSync, launchWin } from './api/launch-win'

/*** Platform ***/

const platform = os.platform()
const isMac = platform === 'darwin'
const isWin = platform === 'win32'

const PROGRAM_DIR = isMac
    ? path.resolve('/Applications')
    : path.resolve('C:/Program Files/Adobe')

/*** Helper ***/

function assertSupportedPlatform(): void {
    if (!isMac && !isWin)
        throw new Error('Cannot run After Effects commands in an environment it cannot be installed in.')
}

function wrapResult<R extends Json | void>(
    results: AfterEffectsResults | null
): ExecuteResult<R> | null {

    // parseResults has already forwarded logs to the logger and thrown
    // AfterEffectsScriptError for any error reported by the script.
    return results === null
        ? null
        : {
            result: results.result as R,
            logs: results.logs ?? []
        }
}

/*** Main ***/

function sendToAfterEffects<A extends Json[], R extends Json | void>(
    config: ScriptConfig<A, R>,
    args: A,
    renderEngine = false
): ExecuteResult<R> | null {

    assertSupportedPlatform()

    const { adobified, resultUrl } = buildAdobified(config, args, config.serializeResult ?? true)
    const programDir = config.appPath || PROGRAM_DIR

    const aeUrl = findAfterEffectsSync(programDir, isMac)
    if (!aeUrl)
        throw new AfterEffectsMissingError()

    const results = isMac
        ? launchMacSync(adobified, aeUrl, resultUrl, console.log, renderEngine)
        : launchWinSync(adobified, aeUrl, resultUrl, console.log, renderEngine)

    return wrapResult(results)
}

export async function sendToAfterEffectsAsync<A extends Json[], R extends Json | void>(
    config: ScriptConfig<A, R>,
    args: A,
    renderEngine = false
): Promise<ExecuteResult<R> | null> {

    assertSupportedPlatform()

    const { adobified, resultUrl } = buildAdobified(config, args, config.serializeResult ?? true)
    const programDir = config.appPath || PROGRAM_DIR

    const aeUrl = await findAfterEffects(programDir, isMac)
    if (!aeUrl)
        throw new AfterEffectsMissingError()

    const results = isMac
        ? await launchMac(adobified, aeUrl, resultUrl, console.log, renderEngine)
        : await launchWin(adobified, aeUrl, resultUrl, console.log, renderEngine)

    return wrapResult(results)
}

/*** Exports ***/

export default sendToAfterEffects
