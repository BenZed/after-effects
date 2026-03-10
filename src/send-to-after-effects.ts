import os from 'os'
import path from 'path'

import { Json, CommandConfig, ExecuteResult } from './types'
import toEs3Script from './to-es3-script'
import { adobify } from './util/transpile'
import { findAfterEffectsSync, findAfterEffects, AfterEffectsMissingError } from './api/common'
import { launchMacSync, launchMac } from './api/launch-mac'
import { launchWinSync, launchWin } from './api/launch-win'

/*** Platform ***/

const platform = os.platform()
const isMac = platform === 'darwin'
const isWin = !isMac && platform.includes('win')

const PROGRAM_DIR = isMac
    ? path.resolve('/Applications')
    : path.resolve('C:/Program Files/Adobe')

/*** Helper ***/

function buildAdobified<A extends Json[]>(command: CommandConfig<A, Json | void>, args: A) {

    // When targeting the legacy ExtendScript environment, run the source through
    // toEs3Script() which babelifies it to ES3 and splits out babel prefixes.
    // Otherwise pass the raw source so modern JS (UXP) is left intact.
    const transpile = command.transpileToEs3 ?? true
    const scriptCmd = transpile
        ? toEs3Script(command.source)
        : { code: ['', `(${command.source.toString()})`], isFunctionExpression: true }

    const serialize = command.serializeResult ?? true
    const options = {
        handleErrors: !!serialize,
        writeResults: !!serialize
    }

    return adobify(scriptCmd, [], options, ...args)
}

function wrapResult<R extends Json | void>(raw: unknown, command: CommandConfig<any, R>): ExecuteResult<R> | null {
    if (!(command.serializeResult ?? true) || raw === null || raw === undefined)
        return null

    return {
        result: raw as R,
        error: null,
        logs: { info: [], warn: [], error: [] }
    }
}

/*** Main ***/

function sendToAfterEffects<A extends Json[], R extends Json | void>(
    command: CommandConfig<A, R>,
    args: A,
    renderEngine = false
): ExecuteResult<R> | null {

    const { adobified, resultUrl } = buildAdobified(command, args)
    const programDir = command.appPath || PROGRAM_DIR

    const aeUrl = findAfterEffectsSync(programDir, isMac)
    if (!aeUrl)
        throw new AfterEffectsMissingError()

    if (!isMac && !isWin)
        throw new Error('Cannot run After Effects commands in an environment it cannot be installed in.')

    const raw = isMac
        ? launchMacSync(adobified, aeUrl, resultUrl, console.log, renderEngine)
        : launchWinSync(adobified, aeUrl, resultUrl, console.log, renderEngine)

    return wrapResult(raw, command)
}

export async function sendToAfterEffectsAsync<A extends Json[], R extends Json | void>(
    command: CommandConfig<A, R>,
    args: A,
    renderEngine = false
): Promise<ExecuteResult<R> | null> {

    const { adobified, resultUrl } = buildAdobified(command, args)
    const programDir = command.appPath || PROGRAM_DIR

    const aeUrl = await findAfterEffects(programDir, isMac)
    if (!aeUrl)
        throw new AfterEffectsMissingError()

    if (!isMac && !isWin)
        throw new Error('Cannot run After Effects commands in an environment it cannot be installed in.')

    const raw = isMac
        ? await launchMac(adobified, aeUrl, resultUrl, console.log, renderEngine)
        : await launchWin(adobified, aeUrl, resultUrl, console.log, renderEngine)

    return wrapResult(raw, command)
}

/*** Exports ***/

export default sendToAfterEffects
