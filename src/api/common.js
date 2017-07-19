import path from 'path'
import fs from 'fs-extra'
import { exec } from 'child_process'
import os from 'os'

import { isAccessibleDirSync, isAccessibleDir, isAccessibleFileSync, isAccessibleFile }
  from '../util/fs-util'

/******************************************************************************/
// Helpers
/******************************************************************************/

export const execPromise = (...args) => new Promise((resolve, reject) => {
  exec(...args, (err, result) => {
    if (err)
      reject(err)
    else
      resolve(result)
  })
})

// export const CMD_RES_DIR = path.join(process.cwd(), 'cmd-res-test')
// Switch these comments when testings
export const CMD_RES_DIR = os.tmpdir()

/******************************************************************************/
// Errors
/******************************************************************************/

export class AfterEffectsMissingError extends Error {
  constructor (message) {
    super('After Effects could not be found.' + (message ? '\n' + message : ''))
    this.name = 'AfterEffectsMissing'
  }
}

export class NoResultError extends Error {
  constructor (message) {
    super('Could not get results from After Effects. Ensure that "Preferences" >' +
    ' "General" > "Allow Scripts" to Write Files and Access Network is enabled,' +
    ' and that you have write permissions to temporary folders.' +
    (message ? '\n' + message : ''))

    this.name = 'NoResultError'
  }
}

export class AfterEffectsScriptError extends Error {
  constructor (message) {
    super('Script execution error inside of After Efects' + (message ? ': ' + message : '.'))
    this.name = 'AfterEffectsScriptError'
  }
}

/******************************************************************************/
// Find After Effects
/******************************************************************************/

function afterEffectsNameMatch (url) {

  const ext = path.extname(url)
  const basename = path.basename(url, ext)

  const key = 'Adobe After Effects'

  return basename.includes(key)

}

async function getAfterEffectsInDir (dir, isMac) {

  const EXT = isMac ? '.app' : '.lnk'
  // In Mac, The After Effects program is really just another Directory, so we
  // cant check if it's an accessible file.
  const isAccessible = isMac ? isAccessibleDir : isAccessibleFile

  const names = await fs.readdir(dir)
  for (const name of names) {
    const url = path.join(dir, name)

    if (await isAccessible(url) && afterEffectsNameMatch(url) && url.endsWith(EXT))
      return url
  }

  return null
}

function getAfterEffectsInDirSync (dir, isMac) {

  const EXT = isMac ? '.app' : '.lnk'
  const isAccessible = isMac ? isAccessibleDirSync : isAccessibleFileSync

  const names = fs.readdirSync(dir)
  for (const name of names) {
    const url = path.join(dir, name)

    if (isAccessible(url) && afterEffectsNameMatch(url) && url.endsWith(EXT))
      return url
  }

  return null
}

export async function findAfterEffects (dir, isMac) {

  let afterEffects = await getAfterEffectsInDir(dir, isMac)
  if (afterEffects)
    return afterEffects

  const names = await fs.readdir(dir)
  for (const name of names) {

    const url = path.join(dir, name)

    if (await isAccessibleDir(url) && afterEffectsNameMatch(url))
      afterEffects = await findAfterEffects(url, isMac)

    if (afterEffects)
      break

  }

  return afterEffects

}

export function findAfterEffectsSync (dir, isMac) {

  let afterEffects = getAfterEffectsInDirSync(dir, isMac)
  if (afterEffects)
    return afterEffects

  const names = fs.readdirSync(dir)
  for (const name of names) {

    const url = path.join(dir, name)

    if (isAccessibleDirSync(url) && afterEffectsNameMatch(url))
      afterEffects = findAfterEffectsSync(url, isMac)

    if (afterEffects)
      break

  }

  return afterEffects

}

/******************************************************************************/
// Parse Results
/******************************************************************************/

export function parseResults (resultUrl, logger) {

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
    logger(...log) // each log will be an array

  if (error)
    throw new AfterEffectsScriptError(error)

  return result
}
