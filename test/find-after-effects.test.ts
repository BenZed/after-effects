import { describe, it, expect } from 'vitest'

import fs from 'fs'
import os from 'os'
import path from 'path'

import { findAfterEffects, findAfterEffectsSync } from '../src/api/common'

// The finder's mac/win flavor is a parameter, not a platform constant, so
// both flavors are exercised on every OS the suite runs on.

function fakeProgramDir(): string {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'ae-find-test-'))
}

function fakeMacInstall(root: string): string {
    // on mac the app is a directory inside the install folder
    const installDir = path.join(root, 'Adobe After Effects 2026')
    const appUrl = path.join(installDir, 'Adobe After Effects 2026.app')
    fs.mkdirSync(appUrl, { recursive: true })
    return appUrl
}

function fakeWinInstall(root: string): string {
    // on windows the finder looks for the .lnk shortcut file
    const installDir = path.join(root, 'Adobe After Effects 2026')
    fs.mkdirSync(installDir, { recursive: true })
    const lnkUrl = path.join(installDir, 'Adobe After Effects 2026.lnk')
    fs.writeFileSync(lnkUrl, '')
    return lnkUrl
}

describe('findAfterEffectsSync', () => {

    it('finds a mac-style .app directory', () => {
        const root = fakeProgramDir()
        const appUrl = fakeMacInstall(root)

        expect(findAfterEffectsSync(root, true)).toBe(appUrl)
    })

    it('finds a windows-style .lnk shortcut', () => {
        const root = fakeProgramDir()
        const lnkUrl = fakeWinInstall(root)

        expect(findAfterEffectsSync(root, false)).toBe(lnkUrl)
    })

    it('returns null when nothing matches', () => {
        const root = fakeProgramDir()
        fs.mkdirSync(path.join(root, 'Adobe Photoshop 2026'))

        expect(findAfterEffectsSync(root, true)).toBeNull()
        expect(findAfterEffectsSync(root, false)).toBeNull()
    })

    it('returns null for unreadable directories instead of throwing', () => {
        const missing = path.join(fakeProgramDir(), 'does-not-exist')

        expect(findAfterEffectsSync(missing, true)).toBeNull()
        expect(findAfterEffectsSync(missing, false)).toBeNull()
    })

})

describe('findAfterEffects (async)', () => {

    it('finds a mac-style .app directory', async () => {
        const root = fakeProgramDir()
        const appUrl = fakeMacInstall(root)

        expect(await findAfterEffects(root, true)).toBe(appUrl)
    })

    it('finds a windows-style .lnk shortcut', async () => {
        const root = fakeProgramDir()
        const lnkUrl = fakeWinInstall(root)

        expect(await findAfterEffects(root, false)).toBe(lnkUrl)
    })

    it('returns null when nothing matches', async () => {
        const root = fakeProgramDir()

        expect(await findAfterEffects(root, true)).toBeNull()
    })

})
