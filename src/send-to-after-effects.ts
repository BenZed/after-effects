import os from 'os'
import path from 'path'

import { Json, Command, ExecuteResult } from './types'
import OldCommand from './command'
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

function buildAdobified<A extends Json[]>(command: Command<A, Json | void>, args: A) {

    // Use the legacy Command class so we can pass it to adobify(), which handles
    // the full Adobe scripting boilerplate (error trapping, result file writing, etc.)
    const oldCmd = new OldCommand(command.source)

    const options = {
        handleErrors: !!command.serializeResult,
        writeResults: !!command.serializeResult
    }

    return adobify(oldCmd, [], options, ...args)
}

function wrapResult<R extends Json | void>(raw: unknown, command: Command<any, R>): ExecuteResult<R> | null {
    if (!command.serializeResult || raw === null || raw === undefined)
        return null

    return {
        result: raw as R,
        error: null,
        logs: { info: [], warn: [], error: [] }
    }
}

/*** Main ***/

function sendToAfterEffects<A extends Json[], R extends Json | void>(
    command: Command<A, R>,
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
    command: Command<A, R>,
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
