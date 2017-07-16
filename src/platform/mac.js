import { adobify } from '../util/transpile'
import os from 'os'
import path from 'path'
import uuid from 'uuid'
import jsesc from 'jsesc'

import { exec, execSync } from 'child_process'

import fs from 'fs-extra'

import { isAccessibleDirSync, isAccessibleDir } from '../util/fs-util'

import { AfterEffectsMissingError, NoResultError, AfterEffectsScriptError } from './errors'

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

function executeAppleScriptSync (scriptUrl, resultUrl) {

  try {
    execSync(`osascript ${scriptUrl}`)
  } catch (err) {
    throw checkForMissingAppHack(err)
  }

  return parseResults(resultUrl)

}

async function executeAppleScript (scriptUrl, resultUrl) {

  try {
    await execPromise(`osascript ${scriptUrl}`)
  } catch (err) {
    log.task(err)
    throw checkForMissingAppHack(err)
  }

  return parseResults(resultUrl)
}

function parseResults (resultUrl) {

  // Adobe doesn't have a JSON object, but it does have a function called 'toSource()'
  // which returns an eval()ible string that describes a javascript obbject.
  // as a result, we have to syncronously require() the results.

  if (resultUrl === null)
    return null

  const results = require(resultUrl)

  const { error, logs = [], result } = results

  if (logs.length > 0)
    console.log(...logs)

  if (error)
    throw new AfterEffectsScriptError(error)

  return result
}

/******************************************************************************/
// Exports
/******************************************************************************/

export function executeSync (source, ...args) {

  const { adobified, resultUrl } = adobify(this.options, source, ...args)
  const { programDir, renderEngine } = this.options

  const aeUrl = findAfterEffectsSync(programDir, renderEngine)
  if (aeUrl === null)
    throw new AfterEffectsMissingError()

  const scrptUrl = writeAppleScriptSync(adobified, aeUrl)

  return executeAppleScriptSync(scrptUrl, resultUrl)

}

export async function execute (source, ...args) {

  const { adobified, resultUrl } = adobify(this.options, source, ...args)
  const { programDir, renderEngine } = this.options

  const aeUrl = await findAfterEffects(programDir, renderEngine)
  if (aeUrl === null)
    throw new AfterEffectsMissingError()

  const scrptUrl = await writeAppleScript(adobified, aeUrl)

  return executeAppleScript(scrptUrl, resultUrl)

}

export function createSync (source, ...args) { console.log('createSync', source, ...args) }

export async function create (source, ...args) { console.log('create', source, ...args) }
