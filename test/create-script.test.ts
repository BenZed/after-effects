import { describe, it, expect } from 'vitest'

import fs from 'fs'
import os from 'os'
import path from 'path'

import { createScript, createScriptSync } from '../src/create-script'
import { AfterEffectsMissingError } from '../src/api/common'

const isMac = os.platform() === 'darwin'

// Fabricate an After Effects install matching the host platform's flavor so
// the whole create-script path - finding ae, resolving the scripts folder,
// writing the jsx - runs for real on every OS, no Adobe required.
function fakeAfterEffectsInstall(): { root: string, scriptsDir: string } {

    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ae-create-test-'))
    const installDir = path.join(root, 'Adobe After Effects 2026')

    if (isMac)
        fs.mkdirSync(path.join(installDir, 'Adobe After Effects 2026.app'), { recursive: true })
    else {
        fs.mkdirSync(installDir, { recursive: true })
        fs.writeFileSync(path.join(installDir, 'Adobe After Effects 2026.lnk'), '')
    }

    const scriptsDir = isMac
        ? path.join(installDir, 'Scripts')
        : path.join(installDir, 'Support Files', 'Scripts')

    fs.mkdirSync(scriptsDir, { recursive: true })

    return { root, scriptsDir }
}

function emptyDir(): string {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'ae-empty-test-'))
}

describe('createScriptSync', () => {

    it('writes a transpiled jsx into the scripts folder', () => {
        const { root, scriptsDir } = fakeAfterEffectsInstall()

        createScriptSync({
            source: () => undefined,
            serializeResult: false,
            scriptName: 'my-script.jsx',
            appPath: root
        })

        const jsxUrl = path.join(scriptsDir, 'my-script.jsx')
        expect(fs.existsSync(jsxUrl)).toBe(true)
        expect(fs.readFileSync(jsxUrl, 'utf-8')).toContain('function')
    })

    it('honors absolute script paths', () => {
        const { root } = fakeAfterEffectsInstall()
        const jsxUrl = path.join(emptyDir(), 'absolute.jsx')

        createScriptSync({
            source: () => undefined,
            serializeResult: false,
            scriptName: jsxUrl,
            appPath: root
        })

        expect(fs.existsSync(jsxUrl)).toBe(true)
    })

    it('prepends the shim when requested', () => {
        const { root, scriptsDir } = fakeAfterEffectsInstall()

        createScriptSync({
            source: () => undefined,
            serializeResult: false,
            prependEsnextShim: true,
            scriptName: 'shimmed.jsx',
            appPath: root
        })

        const contents = fs.readFileSync(path.join(scriptsDir, 'shimmed.jsx'), 'utf-8')
        expect(contents).toContain('Array.prototype.filter')
        expect(contents).toContain('Object.assign')
    })

    it('throws AfterEffectsMissingError when after effects is not installed', () => {
        expect(() => createScriptSync({
            source: () => undefined,
            serializeResult: false,
            scriptName: 'nope.jsx',
            appPath: emptyDir()
        })).toThrow(AfterEffectsMissingError)
    })

})

describe('createScript (async)', () => {

    it('writes a transpiled jsx into the scripts folder', async () => {
        const { root, scriptsDir } = fakeAfterEffectsInstall()

        await createScript({
            source: () => undefined,
            serializeResult: false,
            scriptName: 'async-script.jsx',
            appPath: root
        })

        expect(fs.existsSync(path.join(scriptsDir, 'async-script.jsx'))).toBe(true)
    })

    it('throws AfterEffectsMissingError when after effects is not installed', async () => {
        await expect(createScript({
            source: () => undefined,
            serializeResult: false,
            scriptName: 'nope.jsx',
            appPath: emptyDir()
        })).rejects.toThrow(AfterEffectsMissingError)
    })

})
