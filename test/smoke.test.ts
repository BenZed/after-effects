import { describe, it, expect } from 'vitest'

describe('package entry point', () => {

    // Importing must be safe on every OS — CI runs this on linux, windows and
    // macos. A module-level platform throw (as the legacy api/index.ts had)
    // would fail here before any function is even called.
    it('imports without side effects on any platform', async () => {
        const mod = await import('../src/index')

        expect(typeof mod.default).toBe('function')
        expect(typeof mod.execute).toBe('function')
        expect(typeof mod.executeSync).toBe('function')
        expect(typeof mod.createScript).toBe('function')
        expect(typeof mod.createScriptSync).toBe('function')
    })

})
