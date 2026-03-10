import os from 'os'
import path from 'path'

import { Json, CommandConfig, ExecuteResult } from './types'
import toEs3Script from './command'
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

function buildAdobified<A extends Json[]>(config: CommandConfig<A, Json | void>, args: A) {

    // When targeting the legacy ExtendScript environment, run the source through
    // toEs3Script which babelifies it to ES3 and splits out babel prefixes.
    // Otherwise pass the raw source so modern JS (UXP) is left intact.
    const transpileToEs3 = config.transpileToEs3 ?? true
    const scriptCmd = transpileToEs3
        ? new toEs3Script(config.source)
        : { code: ['', `(${config.source.toString()})`], isFunctionExpression: true }

    const options = {
        handleErrors: !!config.serializeResult,
        writeResults: !!config.serializeResult
    }

    return adobify(scriptCmd as any, [], options, ...args)
}

function wrapResult<R extends Json | void>(raw: unknown, serializeResult: boolean | undefined): ExecuteResult<R> | null {
    if (!serializeResult || raw === null || raw === undefined)
        return null

    return {
        result: raw as R,
        error: null,
        logs: { info: [], warn: [], error: [] }
    }
}

/*** Main ***/

function sendToAfterEffects<A extends Json[], R extends Json | void>(
    config: CommandConfig<A, R>,
    args: A,
    renderEngine = false
): ExecuteResult<R> | null {

    const { adobified, resultUrl } = buildAdobified(config, args)
    const programDir = config.appPath || PROGRAM_DIR

    const aeUrl = findAfterEffectsSync(programDir, isMac)
    if (!aeUrl)
        throw new AfterEffectsMissingError()

    if (!isMac && !isWin)
        throw new Error('Cannot run After Effects commands in an environment it cannot be installed in.')

    const raw = isMac
        ? launchMacSync(adobified, aeUrl, resultUrl, console.log, renderEngine)
        : launchWinSync(adobified, aeUrl, resultUrl, console.log, renderEngine)

    return wrapResult(raw, config.serializeResult)
}

export async function sendToAfterEffectsAsync<A extends Json[], R extends Json | void>(
    config: CommandConfig<A, R>,
    args: A,
    renderEngine = false
): Promise<ExecuteResult<R> | null> {

    const { adobified, resultUrl } = buildAdobified(config, args)
    const programDir = config.appPath || PROGRAM_DIR

    const aeUrl = await findAfterEffects(programDir, isMac)
    if (!aeUrl)
        throw new AfterEffectsMissingError()

    if (!isMac && !isWin)
        throw new Error('Cannot run After Effects commands in an environment it cannot be installed in.')

    const raw = isMac
        ? await launchMac(adobified, aeUrl, resultUrl, console.log, renderEngine)
        : await launchWin(adobified, aeUrl, resultUrl, console.log, renderEngine)

    return wrapResult(raw, config.serializeResult)
}

/*** Exports ***/

export default sendToAfterEffects
