import { describe, it, expect } from 'vitest'

import buildAdobified from '../src/build-adobified'

describe('buildAdobified', () => {

    it('transpiles to es3 by default', () => {
        const { adobified } = buildAdobified({ source: (a: number) => a + 1 }, [1], false)

        expect(adobified).not.toContain('=>')
        expect(adobified).toContain('function')
    })

    it('passes modern js through untouched when transpileToEs3 is false', () => {
        const { adobified } = buildAdobified(
            { source: (a: number) => a + 1, transpileToEs3: false },
            [1],
            false
        )

        expect(adobified).toContain('=>')
    })

    it('prepends the esnext shim when requested', () => {
        const { adobified } = buildAdobified(
            { source: () => undefined, prependEsnextShim: true },
            [],
            false
        )

        // es5 baseline from extendscript-es5-shim
        expect(adobified).toContain('Array.prototype.filter')
        // es2015+ layer from esnext-shim
        expect(adobified).toContain('Object.assign')
        expect(adobified).toContain('findLastIndex')
    })

    it('omits the shim by default', () => {
        const { adobified } = buildAdobified({ source: () => undefined }, [], false)

        expect(adobified).not.toContain('Array.prototype.filter')
        expect(adobified).not.toContain('findLastIndex')
    })

    it('prepends custom es3 code before the script body', () => {
        const customEs3 = 'var CUSTOM_INJECTED = true;'
        const { adobified } = buildAdobified(
            { source: () => undefined, prependCustomEs3: [customEs3] },
            [],
            false
        )

        expect(adobified).toContain(customEs3)
        expect(adobified.indexOf(customEs3)).toBeLessThan(adobified.indexOf('.apply(this,'))
    })

    it('only produces a result url when serializing', () => {
        const config = { source: () => undefined }

        expect(buildAdobified(config, [], false).resultUrl).toBeNull()
        expect(buildAdobified(config, [], true).resultUrl).not.toBeNull()
    })

})
