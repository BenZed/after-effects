import path from 'path'
import uuid from 'uuid'

import { execSync } from 'child_process'
import { write, writeSync, tryUnlink, tryUnlinkSync } from '../util/fs-util'
import { parseResults, execPromise, CMD_RES_DIR } from './common'

/******************************************************************************/
// afterfx.exe flags
/******************************************************************************/

// -r run a script
// -s run code provided as string
// -noui don't show the ui
//

/******************************************************************************/
// Data
/******************************************************************************/

const STDIO = []

/******************************************************************************/
// Helper
/******************************************************************************/

function execOptions (jsxUrl, aeUrl) {

  const aeDir = path.dirname(aeUrl)

  // Use .com instead of .exe to prevent it from erroring all the time
  const cmd = `afterfx.com -r "${jsxUrl}"`

  const cwd = path.join(aeDir, 'Support Files')

  return [ cmd, { cwd, stdio: STDIO } ]

}

function writeJsxSync (jsxTxt) {
  const jsxUrl = path.join(CMD_RES_DIR, `ae-command-${uuid.v4()}.jsx`)

  writeSync(jsxUrl, jsxTxt)

  return jsxUrl
}

async function writeJsx (jsxTxt) {

  const jsxUrl = path.join(CMD_RES_DIR, `ae-command-${uuid.v4()}.jsx`)

  await write(jsxUrl, jsxTxt)

  return jsxUrl
}

function executeJsxSync (jsxUrl, aeUrl, resultUrl, logger) {

  const options = execOptions(jsxUrl, aeUrl)

  execSync(...options)

  const results = parseResults(resultUrl, logger)

  tryUnlinkSync(jsxUrl)
  tryUnlinkSync(resultUrl)

  return results

}

async function executeJsx (jsxUrl, aeUrl, resultUrl, logger) {

  console.log(jsxUrl, '\n' + resultUrl)

  const options = execOptions(jsxUrl, aeUrl)

  await execPromise(...options)

  const results = parseResults(resultUrl, logger)

  await tryUnlink(jsxUrl)
  await tryUnlink(resultUrl)

  return results

}

/******************************************************************************/
// Exports
/******************************************************************************/

export function launchWinSync (adobified, aeUrl, resultUrl, logger) {

  const jsxUrl = writeJsxSync(adobified)

  return executeJsxSync(jsxUrl, aeUrl, resultUrl, logger)

}

export async function launchWin (adobified, aeUrl, resultUrl, logger) {

  const jsxUrl = await writeJsx(adobified)

  return executeJsx(jsxUrl, aeUrl, resultUrl, logger)

}
