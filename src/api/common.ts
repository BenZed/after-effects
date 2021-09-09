import { exec } from 'child_process'

import {
  readSync,
  readDir,
  readDirSync,
  isAccessibleDirSync,
  isAccessibleDir,
  isAccessibleFileSync,
  isAccessibleFile
} from '../util/fs-util'

import { AfterEffectsResults, ErrorJson } from '../types'

import os from 'os'
import jsesc from 'jsesc'
import path from 'path'

// Types

type Func<A extends any[]> = (...args: A) => any

type AllButLastParameter<P> = P extends Func<[...infer A, any]> ? A : never

// Helpers

export const execPromise = (...args: AllButLastParameter<typeof exec>) => new Promise((resolve, reject) => {
  exec(...args, (err, result) => {
    if (err)
      reject(err)
    else
      resolve(result)
  })
})

export function escaped(str: string, quotes: 'double' | 'single' = 'double') {
  return jsesc(str, { quotes })
}

// Command & Response Directory

// export const CMD_RES_DIR = path.join(process.cwd(), 'cmd-res-test')
// Switch these comments when testings
export const CMD_RES_DIR = os.tmpdir()

// Errors

export class AfterEffectsMissingError extends Error {
  constructor(message?: string) {
    super('After Effects could not be found.' + (message ? '\n' + message : ''))
    this.name = 'AfterEffectsMissing'
  }
}

export class NoResultError extends Error {
  constructor(message: string) {
    super('Could not get results from After Effects. Ensure that "Preferences" >' +
      ' "General" > "Allow Scripts" to Write Files and Access Network is enabled,' +
      ' and that you have write permissions to temporary folders.' +
      (message ? '\n' + message : ''))

    this.name = 'NoResultError'
  }
}

export class AfterEffectsScriptError extends Error {
  constructor(err: ErrorJson) {
    super('Script execution error inside of After Effects' + (err.message ? ': ' + err.message : '.'))
    this.name = 'AfterEffectsScriptError'
    this.stack = err.stack
  }
}

// Find After Effects

function afterEffectsNameMatch(url: string) {

  const ext = path.extname(url)
  const basename = path.basename(url, ext)

  const key = 'Adobe After Effects'

  return basename.includes(key)

}

async function getAfterEffectsInDir(dir: string, isMac: boolean) {

  const EXT = isMac ? '.app' : '.lnk'
  // In Mac, The After Effects program is really just another Directory, so we
  // cant check if it's an accessible file.
  const isAccessible = isMac ? isAccessibleDir : isAccessibleFile

  const names = await readDir(dir)
  for (const name of names) {
    const url = path.join(dir, name)

    if (await isAccessible(url) && afterEffectsNameMatch(url) && url.endsWith(EXT))
      return url
  }

  return null
}

function getAfterEffectsInDirSync(dir: string, isMac: boolean) {

  const EXT = isMac ? '.app' : '.lnk'
  const isAccessible = isMac ? isAccessibleDirSync : isAccessibleFileSync

  const names = readDirSync(dir)
  for (const name of names) {
    const url = path.join(dir, name)

    if (isAccessible(url) && afterEffectsNameMatch(url) && url.endsWith(EXT))
      return url
  }

  return null
}

export async function findAfterEffects(dir: string, isMac: boolean): Promise<string | null> {

  let afterEffects = await getAfterEffectsInDir(dir, isMac)
  if (afterEffects)
    return afterEffects

  const names = await readDir(dir)
  for (const name of names) {

    const url = path.join(dir, name)

    if (await isAccessibleDir(url) && afterEffectsNameMatch(url))
      afterEffects = await findAfterEffects(url, isMac)

    if (afterEffects)
      break

  }

  return afterEffects

}

export function findAfterEffectsSync(dir: string, isMac: boolean): string | null {

  let afterEffects = getAfterEffectsInDirSync(dir, isMac)
  if (afterEffects)
    return afterEffects

  const names = readDirSync(dir)
  for (const name of names) {

    const url = path.join(dir, name)

    if (isAccessibleDirSync(url) && afterEffectsNameMatch(url))
      afterEffects = findAfterEffectsSync(url, isMac)

    if (afterEffects)
      break

  }

  return afterEffects

}

// Parse Results

export function parseResults(resultUrl: string, logger: (...args: any[]) => void) {

  // Adobe doesn't have a JSON object, but it does have a function called 'toSource()'
  // which returns an eval()ible string that describes a javascript obbject.
  // as a result, we have to syncronously require() the results.

  if (resultUrl === null)
    return null

  let results

  try {
    results = JSON.parse(readSync(resultUrl)) as AfterEffectsResults
  } catch (err: any) {
    throw new NoResultError(err.message)
  }

  const { error, logs = [], result } = results

  for (const log of logs)
    logger(...log) // each log will be an array

  if (error)
    throw new AfterEffectsScriptError(error)

  return result
}
