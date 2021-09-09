import os from 'os'
import path from 'path'

import { adobify } from '../util/transpile'
import { write, writeSync } from '../util/fs-util'

import { AfterEffectsMissingError, findAfterEffects, findAfterEffectsSync } from './common'

import { launchMac, launchMacSync } from './launch-mac'
import { launchWin, launchWinSync } from './launch-win'

import Command from '../command'

// Platform Specific Switches

const platform = os.platform()
const isMac = platform === 'darwin'
const isWin = !isMac && platform.includes('win')

if (!isMac && !isWin)
    throw new Error('Cannot run After Effects commands in an environment it can\'t be installed in.')

const PROGRAM_DIR = isMac
    ? path.resolve('/Applications')
    : path.resolve('C:/Program Files/Adobe')

const SCRIPT_SUBPATH = isMac
    ? 'Scripts'
    : 'Support Files/Scripts'

const launch = isMac
    ? launchMac
    : launchWin

const launchSync = isMac
    ? launchMacSync
    : launchWinSync

// Perperation common to sync and async

function prepareExec(source, includes, options, ...args) {

    const command = Command.fromSource(source)

    const { adobified, resultUrl } = adobify(command, includes, options, ...args)
    const { programDir, logger, renderEngine } = options

    return { programDir, adobified, resultUrl, logger, renderEngine }
}

function prepareCreate(source, includes, options, ...args) {

    const command = Command.fromSource(source)

    const createOptions = {
        ...options,
        handleErrors: false,
        writeResults: false
    }

    const { adobified } = adobify(command, includes, createOptions, ...args)

    return { options: createOptions, adobified }
}

// Exports

export function executeSync(source, ...args) {
    const { programDir = PROGRAM_DIR, adobified, resultUrl, logger, renderEngine } =
        prepareExec(source, this.code, this.options, ...args)

    const aeUrl = findAfterEffectsSync(programDir, isMac)
    if (aeUrl === null)
        throw new AfterEffectsMissingError()

    return launchSync(adobified, aeUrl, resultUrl, logger, renderEngine)
}

export async function execute(source, ...args) {
    const { programDir = PROGRAM_DIR, adobified, resultUrl, logger, renderEngine } =
        prepareExec(source, this.code, this.options, ...args)

    const aeUrl = await findAfterEffects(programDir, isMac)
    if (aeUrl === null)
        throw new AfterEffectsMissingError()

    return launch(adobified, aeUrl, resultUrl, logger, renderEngine)
}

export function createSync(source, url, ...args) {
    const { options, adobified } = prepareCreate(source, this[CODE], this.options, ...args)

    const jsxUrl = path.isAbsolute(url)
        ? url
        : path.resolve(getScriptsDirSync(options) ?? '', url)

    writeSync(jsxUrl, adobified)

    return jsxUrl
}

export async function create(source, url, ...args) {
    const { options, adobified } = prepareCreate(source, this.code, this.options, ...args)

    const jsxUrl = path.isAbsolute(url)
        ? url
        : path.resolve(await getScriptsDir(options), url)

    await write(jsxUrl, adobified)

    return jsxUrl
}

export function getScriptsDirSync(options) {
    const { programDir = PROGRAM_DIR } = options || this.options

    const aeUrl = findAfterEffectsSync(programDir, isMac)
    if (aeUrl === null)
        return null

    const aeDir = path.dirname(aeUrl)

    return path.join(aeDir, SCRIPT_SUBPATH)
}

export async function getScriptsDir(options) {
    const { programDir = PROGRAM_DIR } = options || this.options

    const aeUrl = await findAfterEffects(programDir, isMac)
    if (aeUrl === null)
        return null

    const aeDir = path.dirname(aeUrl)

    return path.join(aeDir, SCRIPT_SUBPATH)
}
