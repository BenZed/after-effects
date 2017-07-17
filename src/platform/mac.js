import os from 'os'
import path from 'path'
import uuid from 'uuid'
import jsesc from 'jsesc'
import fs from 'fs-extra'
import { exec, execSync } from 'child_process'

import { adobify } from '../util/transpile'
import { isAccessibleDirSync, isAccessibleDir } from '../util/fs-util'

import { AfterEffectsMissingError, NoResultError, AfterEffectsScriptError } from './errors'
import Command from '../command'

/******************************************************************************/
// Data
/******************************************************************************/

const TMP = os.tmpdir()

const DEFAULT_PROGRAM_DIR = path.resolve('/Applications')

/******************************************************************************/
// Errors
/******************************************************************************/

class CouldNotCreateAppleScriptError extends Error {
  constructor (msg) {
    super('Could not create AppleScript file for After Effects execution' +
    (msg ? ': ' + msg : '.'))

    this.name = 'CouldNotCreateAppleScript'
  }
}

function checkForMissingAppHack (error) {
  // I haven't bothered how to use applescript well enough to determine if the
  // After Effects app exists or not. So, rather than figure it out, I'll just
  // look for an error that includes this string, because that error means that
  // DoScript couldn't complete, which means the suggested After Effects app doesnt
  // exist.
  return error.message.includes('Expected end of line but found')
    ? new AfterEffectsMissingError()
    : error

}

/******************************************************************************/
// Find After Effects
/******************************************************************************/

function afterEffectsNameMatch (url, renderEngine) {

  const ext = path.extname(url)
  const basename = path.basename(url, ext)

  const key = 'Adobe After Effects' + (renderEngine ? ' Render Engine' : '')

  return basename.includes(key)

}

async function getAfterEffectsInDir (dir, renderEngine) {

  const names = await fs.readdir(dir)
  for (const name of names) {
    const url = path.join(dir, name)

    // In Mac, The After Effects program is really just another Directory, so we
    // cant check if it's an accessible file.
    if (await isAccessibleDir(url) && afterEffectsNameMatch(url, renderEngine) && url.endsWith('.app'))
      return url
  }

  return null
}

function getAfterEffectsInDirSync (dir, renderEngine) {

  const names = fs.readdirSync(dir)
  for (const name of names) {
    const url = path.join(dir, name)

    // In Mac, The After Effects program is really just another Directory, so we
    // cant check if it's an accessible file.
    if (isAccessibleDirSync(url) && afterEffectsNameMatch(url, renderEngine) && url.endsWith('.app'))
      return url
  }

  return null
}

async function findAfterEffects (dir = DEFAULT_PROGRAM_DIR, renderEngine) {

  let afterEffects = await getAfterEffectsInDir(dir, renderEngine)
  if (afterEffects)
    return afterEffects

  const names = await fs.readdir(dir)
  for (const name of names) {

    const url = path.join(dir, name)

    if (await isAccessibleDir(url) && afterEffectsNameMatch(url))
      afterEffects = await findAfterEffects(url, renderEngine)

    if (afterEffects)
      break

  }

  return afterEffects

}

function findAfterEffectsSync (dir = DEFAULT_PROGRAM_DIR, renderEngine) {

  let afterEffects = getAfterEffectsInDirSync(dir, renderEngine)
  if (afterEffects)
    return afterEffects

  const names = fs.readdirSync(dir)
  for (const name of names) {

    const url = path.join(dir, name)

    if (isAccessibleDirSync(url) && afterEffectsNameMatch(url))
      afterEffects = findAfterEffectsSync(url, renderEngine)

    if (afterEffects)
      break

  }

  return afterEffects

}

/******************************************************************************/
// Apple Script
/******************************************************************************/

function escaped (quotes = 'double') {
  return jsesc(this, { quotes })
}

const execPromise = (...args) => new Promise((resolve, reject) => {
  exec(...args, (err, result) => {
    if (err)
      reject(err)
    else
      resolve(result)
  })
})

function prepareAppleScript (adobified, aeUrl) {

  const scptUrl = path.join(TMP, `ae-command-${uuid.v4()}.scpt`)

  if (aeUrl.includes('Render Engine.app'))
    throw new Error('Activating the Render Engine for Mac needs to be rethought.' +
    ' It cannot be given tells from applescript like the regular app can. We need' +
    ' to come up with a way to detect if the render engine is running, and switch to it' +
    ' if it is not.')

  const scptTxt = [
    `tell application "${aeUrl}"`,
    `  DoScript "${adobified::escaped()}"`,
    'end tell'
  ].join('\n')

  return [ scptUrl, scptTxt ]

}

function writeAppleScriptSync (adobified, aeUrl) {

  const [ scptUrl, scptTxt ] = prepareAppleScript(adobified, aeUrl)

  try {
    fs.writeFileSync(scptUrl, scptTxt)
  } catch (err) {
    throw new CouldNotCreateAppleScriptError(err.message)
  }

  return scptUrl
}

async function writeAppleScript (adobified, aeUrl) {

  const [ scptUrl, scptTxt ] = prepareAppleScript(adobified, aeUrl)

  try {
    await fs.writeFile(scptUrl, scptTxt)
  } catch (err) {
    throw new CouldNotCreateAppleScriptError(err.message)
  }

  return scptUrl
}

function executeAppleScriptSync (scriptUrl, resultUrl, logger) {

  try {
    execSync(`osascript ${scriptUrl}`)
  } catch (err) {
    throw checkForMissingAppHack(err)
  }

  return parseResults(resultUrl, logger)

}

async function executeAppleScript (scriptUrl, resultUrl, logger) {

  try {
    await execPromise(`osascript ${scriptUrl}`)
  } catch (err) {
    log.task(err)
    throw checkForMissingAppHack(err)
  }

  return parseResults(resultUrl, logger)
}

function parseResults (resultUrl, logger) {

  // Adobe doesn't have a JSON object, but it does have a function called 'toSource()'
  // which returns an eval()ible string that describes a javascript obbject.
  // as a result, we have to syncronously require() the results.

  if (resultUrl === null)
    return null

  let results

  try {
    results = require(resultUrl)
  } catch (err) {
    throw new NoResultError(err.message)
  }

  const { error, logs = [], result } = results

  for (const log of logs)
    logger(log)

  if (error)
    throw new AfterEffectsScriptError(error)

  return result
}

/******************************************************************************/
// Creating Scripts
/******************************************************************************/

function prepareJsx (source, url, options, ...args) {

  const command = Command.fromSource(source)

  const createOptions = { ...options,
    handleErrors: false,
    writeResults: false
  }

  const { adobified } = adobify(command, createOptions, ...args)

  // Add .jsx if an extension wasn't provided
  if (!path.extname(url))
    url += '.jsx'

  const jsxUrl = path.isAbsolute(url)
    ? url
    : path.resolve(getScriptsDir(createOptions), url)

  return {
    adobified,
    jsxUrl
  }

}
/******************************************************************************/
// Exports
/******************************************************************************/

export function executeSync (source, ...args) {

  const command = Command.fromSource(source)

  const { adobified, resultUrl } = adobify(command, this.options, ...args)
  const { programDir, renderEngine, logger } = this.options

  const aeUrl = findAfterEffectsSync(programDir, renderEngine)
  if (aeUrl === null)
    throw new AfterEffectsMissingError()

  const scrptUrl = writeAppleScriptSync(adobified, aeUrl)

  return executeAppleScriptSync(scrptUrl, resultUrl, logger)

}

export async function execute (source, ...args) {

  const command = Command.fromSource(source)

  const { adobified, resultUrl } = adobify(command, this.options, ...args)
  const { programDir, renderEngine, logger } = this.options

  const aeUrl = await findAfterEffects(programDir, renderEngine)
  if (aeUrl === null)
    throw new AfterEffectsMissingError()

  const scrptUrl = await writeAppleScript(adobified, aeUrl)

  return executeAppleScript(scrptUrl, resultUrl, logger)

}

export function createSync (source, url, ...args) {

  const { jsxUrl, adobified } = prepareJsx(source, url, this.options, ...args)

  fs.writeFileSync(jsxUrl, adobified)

  return jsxUrl
}

export async function create (source, url, ...args) {

  const { jsxUrl, adobified } = prepareJsx(source, url, this.options, ...args)

  await fs.writeFile(jsxUrl, adobified)

  return jsxUrl

}

export function getScriptsDir (options) {

  const { programDir } = options || this.options

  const aeUrl = findAfterEffectsSync(programDir)
  if (aeUrl === null)
    return null

  const aeDir = path.dirname(aeUrl)

  return path.join(aeDir, 'Scripts')

}
