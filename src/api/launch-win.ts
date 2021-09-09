import path from 'path'
import uuid from 'uuid'

import { execSync } from 'child_process'
import { write, writeSync, tryUnlink, tryUnlinkSync } from '../util/fs-util'
import { parseResults, execPromise, CMD_RES_DIR } from './common'
import { Logger } from '../types'

/* afterfx.exe flags

-r run a script
-ro ??
-s run code provided as string
-so ??
-m import file
-re render engine
-noui don't show the ui
*/

// Data

const STDIO = [] as const

// Helper

function execSetup(jsxUrl: string, aeUrl: string, renderEngine: boolean) {

    const reArg = renderEngine ? ' -re' : ''
    const aeDir = path.dirname(aeUrl)
    // Okay, so what's going on here?

    // Well, if after effects is already open afterfx.com -r seems to work fine.
    //
    // If if after effects isn't already open, afterfx.com -r can sometimes crash
    // and after effects closes immediatly once the script is complete.
    //
    // afterfx.exe -r always returns an error, regardless of weather one occured or not
    //
    // so the hack solution I've come up with is to run two commands: afterfx.exe to
    // ensure that ae is open, and afterfx.com to actually run the command. This way
    // it doesn't crash and stays open, making the behaviour consistent with Mac

    // Just sending after.exe with no arguments opens it.
    const openCmd = `afterfx.exe${reArg}`

    // Use .com instead of .exe to prevent it from erroring all the time
    const runCmd = `afterfx.com -r "${jsxUrl}"`

    const runOptions = {
        cwd: path.join(aeDir, 'Support Files'),
        stdio: STDIO
    }

    const openOptions = {
        ...runOptions,
        timeout: 10000 // 10 seconds to let After Effects open
    }

    return { openCmd, runCmd, runOptions, openOptions }

}

function writeJsxSync(jsxTxt: string) {
    const jsxUrl = path.join(CMD_RES_DIR, `ae-command-${uuid.v4()}.jsx`)

    writeSync(jsxUrl, jsxTxt)

    return jsxUrl
}

async function writeJsx(jsxTxt: string) {
    const jsxUrl = path.join(CMD_RES_DIR, `ae-command-${uuid.v4()}.jsx`)

    await write(jsxUrl, jsxTxt)

    return jsxUrl
}

function executeJsxSync(jsxUrl: string, aeUrl: string, resultUrl: string, logger: Logger, renderEngine: boolean) {

    const { openCmd, runCmd, runOptions, openOptions } = execSetup(jsxUrl, aeUrl, renderEngine)

    try {
        execSync(openCmd, openOptions)
    } catch (err) {
        // If after effects IS open, the open command will do nothing and close right away.

        // If after effects is NOT open, the open command will open after effects
        // and not close until after effects closes.

        // So, we have to send a timeout command along with execSync in order for
        // node to run the actual script command. A timeout will result in an error,
        // which is what we want, so we swallow it.
    }
    execSync(runCmd, runOptions)

    const results = parseResults(resultUrl, logger)

    return results

}

async function executeJsx(jsxUrl: string, aeUrl: string, resultUrl, logger, renderEngine) {

    const { openCmd, runCmd, runOptions, openOptions } = execSetup(jsxUrl, aeUrl, renderEngine)

    try {
        await execPromise(openCmd, openOptions)
    } catch (err) {
        // See above
    }
    await execPromise(runCmd, runOptions)

    const results = parseResults(resultUrl, logger)

    await tryUnlink(jsxUrl)
    await tryUnlink(resultUrl)

    return results
}

// Exports

export function launchWinSync(adobified, aeUrl, resultUrl, logger, renderEngine) {

    const jsxUrl = writeJsxSync(adobified)

    return executeJsxSync(jsxUrl, aeUrl, resultUrl, logger, renderEngine)
}

export async function launchWin(adobified, aeUrl, resultUrl, logger, renderEngine) {

    const jsxUrl = await writeJsx(adobified)

    return executeJsx(jsxUrl, aeUrl, resultUrl, logger, renderEngine)
}
