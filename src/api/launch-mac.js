import path from 'path'

import uuid from 'uuid'

import { execSync } from 'child_process'
import { write, writeSync, tryUnlink, tryUnlinkSync } from '../util/fs-util'

import { AfterEffectsMissingError, parseResults, execPromise, escaped, CMD_RES_DIR } from './common'

/******************************************************************************/
// Helper
/******************************************************************************/

export class CouldNotCreateAppleScriptError extends Error {
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

function tryStartRenderEngine () {

}

function tryStartRenderEngineSync () {

}

/******************************************************************************/
// Apple Scripts
/******************************************************************************/

function prepareAppleScript (adobified, aeUrl) {

  const scptUrl = path.join(CMD_RES_DIR, `ae-command-${uuid.v4()}.scpt`)

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
    writeSync(scptUrl, scptTxt)
  } catch (err) {
    throw new CouldNotCreateAppleScriptError(err.message)
  }

  return scptUrl
}

async function writeAppleScript (adobified, aeUrl) {

  const [ scptUrl, scptTxt ] = prepareAppleScript(adobified, aeUrl)

  try {
    await write(scptUrl, scptTxt)
  } catch (err) {
    throw new CouldNotCreateAppleScriptError(err.message)
  }

  return scptUrl
}

function executeAppleScriptSync (scriptUrl, resultUrl, logger) {

  try {
    execSync(`osascript ${scriptUrl}`)

    const results = parseResults(resultUrl, logger)

    tryUnlinkSync(scriptUrl)
    tryUnlinkSync(resultUrl)

    return results

  } catch (err) {

    tryUnlinkSync(scriptUrl)
    tryUnlinkSync(resultUrl)

    throw checkForMissingAppHack(err)
  }

}

async function executeAppleScript (scriptUrl, resultUrl, logger) {

  try {
    await execPromise(`osascript ${scriptUrl}`)

    const results = parseResults(resultUrl, logger)

    await tryUnlink(scriptUrl)
    await tryUnlink(resultUrl)

    return results

  } catch (err) {

    await tryUnlink(scriptUrl)
    await tryUnlink(resultUrl)

    throw checkForMissingAppHack(err)
  }
}

/******************************************************************************/
// Exports
/******************************************************************************/

export function launchMacSync (adobified, aeUrl, resultUrl, logger, renderEngine) {

  if (renderEngine)
    tryStartRenderEngineSync()

  const scrptUrl = writeAppleScriptSync(adobified, aeUrl)

  return executeAppleScriptSync(scrptUrl, resultUrl, logger)

}

export async function launchMac (adobified, aeUrl, resultUrl, logger, renderEngine) {

  if (renderEngine)
    await tryStartRenderEngine()

  const scrptUrl = await writeAppleScript(adobified, aeUrl)

  return executeAppleScript(scrptUrl, resultUrl, logger)

}
