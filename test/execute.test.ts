import { describe, it, expect } from 'vitest'

import fs from 'fs'
import os from 'os'
import path from 'path'

import { execute, executeSync } from '../src/execute'

const platform = os.platform()
const isSupported = platform === 'darwin' || platform === 'win32'

function emptyDir(): string {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'ae-exec-test-'))
}

// The full execute path can't run without After Effects, but its failure
// modes are deterministic per platform and shouldn't regress.

describe('executeSync', () => {

    it('fails with the platform-appropriate error when ae is unavailable', () => {

        const attempt = () => executeSync({
            source: () => 1,
            appPath: emptyDir()
        })

        expect(attempt).toThrow(isSupported
            // supported platform, but no ae installed in the given dir
            ? /After Effects could not be found/
            // unsupported platform fails before any lookup
            : /environment it cannot be installed in/
        )
    })

})

describe('execute (async)', () => {

    it('fails with the platform-appropriate error when ae is unavailable', async () => {

        const attempt = execute({
            source: () => 1,
            appPath: emptyDir()
        })

        await expect(attempt).rejects.toThrow(isSupported
            ? /After Effects could not be found/
            : /environment it cannot be installed in/
        )
    })

})
