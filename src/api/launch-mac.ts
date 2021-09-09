import path from 'path'

import uuid from 'uuid'

import { execSync } from 'child_process'
import { write, writeSync, tryUnlink, tryUnlinkSync } from '../util/fs-util'

import { AfterEffectsMissingError, parseResults, execPromise, escaped, CMD_RES_DIR } from './common'

// Helper

export class CouldNotCreateAppleScriptError extends Error {
  constructor(msg: string) {
    super('Could not create AppleScript file for After Effects execution' +
      (msg ? ': ' + msg : '.'))

    this.name = 'CouldNotCreateAppleScript'
  }
}

function checkForMissingAppHack(error: Error) {
  // I haven't bothered how to use applescript well enough to determine if the
  // After Effects app exists or not. So, rather than figure it out, I'll just
  // look for an error that includes this string, because that error means that
  // DoScript couldn't complete, which means the suggested After Effects app doesnt
  // exist.
  return error.message.includes('Expected end of line but found')
    ? new AfterEffectsMissingError()
    : error

}

function getRenderEngineUrl(aeUrl) {
  const aeDir = path.dirname(aeUrl)
  const reUrl = path.join(aeDir, 'Adobe After Effects Render Engine.app')

  return reUrl

}

// Apple Scripts

function prepareAppleScript(adobified, aeUrl, renderEngine) {

  const scptUrl = path.join(CMD_RES_DIR, `ae-command-${uuid.v4()}.scpt`)

  const scptTxt = []

  if (renderEngine) {
    // Only way to get it to work is to run the render engine command if After Effects
    // isn't already running.
    const cmdUrl = getRenderEngineUrl(aeUrl)
    scptTxt.push(
      `if application "${aeUrl}" is not running then`,
      `  tell application "${cmdUrl}" to activate`,
      `  delay 8`,
      'end if'
    )
  }

  scptTxt.push(
    `tell application "${aeUrl}"`,
    `  DoScript "${escaped(adobified)} "`,
    'end tell'
  )

  return [scptUrl, scptTxt.join('\n')]

}

function writeAppleScriptSync(adobified, aeUrl, renderEngine) {

  const [scptUrl, scptTxt] = prepareAppleScript(adobified, aeUrl, renderEngine)

  try {
    writeSync(scptUrl, scptTxt)
  } catch (err) {
    throw new CouldNotCreateAppleScriptError(err.message)
  }

  return scptUrl
}

async function writeAppleScript(adobified, aeUrl, renderEngine) {

  const [scptUrl, scptTxt] = prepareAppleScript(adobified, aeUrl, renderEngine)

  try {
    await write(scptUrl, scptTxt)
  } catch (err) {
    throw new CouldNotCreateAppleScriptError(err.message)
  }

  return scptUrl
}

function executeAppleScriptSync(scriptUrl: string, resultUrl: string, logger) {

  try {
    execSync(`osascript ${scriptUrl}`)

    const results = parseResults(resultUrl, logger)

    tryUnlinkSync(scriptUrl)
    tryUnlinkSync(resultUrl)

    return results

  } catch (err) {

    tryUnlinkSync(scriptUrl)
    tryUnlinkSync(resultUrl)

    throw checkForMissingAppHack(err as Error)
  }

}

async function executeAppleScript(scriptUrl: string, resultUrl: string, logger) {

  try {
    await execPromise(`osascript ${scriptUrl}`, null)

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

// Exports

export function launchMacSync(adobified, aeUrl, resultUrl, logger, renderEngine) {

  const scrptUrl = writeAppleScriptSync(adobified, aeUrl, renderEngine)

  return executeAppleScriptSync(scrptUrl, resultUrl, logger, renderEngine)

}

export async function launchMac(adobified, aeUrl, resultUrl, logger, renderEngine) {

  const scrptUrl = await writeAppleScript(adobified, aeUrl, renderEngine)

  return executeAppleScript(scrptUrl, resultUrl, logger)

}
