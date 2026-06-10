import { describe, it, expect } from 'vitest'

import toEs3Script from '../src/to-es3-script'
import { adobify } from '../src/util/transpile'

describe('adobify', () => {

    it('wraps the script with result writing when enabled', () => {
        const script = toEs3Script((msg: string) => msg)
        const { adobified, resultUrl } = adobify(script, [], { handleErrors: true, writeResults: true }, 'hello')

        expect(resultUrl).not.toBeNull()
        expect(adobified).toContain('$.nodeJS')
        expect(adobified).toContain('$.nodeJS.result = ')
        expect(adobified).toContain('.apply(this,["hello"])')
    })

    it('skips result plumbing when disabled', () => {
        const script = toEs3Script(() => undefined)
        const { adobified, resultUrl } = adobify(script, [], { handleErrors: false, writeResults: false })

        expect(resultUrl).toBeNull()
        expect(adobified).not.toContain('$.nodeJS')
    })

    it('serializes arguments as JSON', () => {
        const script = toEs3Script((a: number, b: { c: boolean }) => [a, b])
        const { adobified } = adobify(script, [], { handleErrors: false, writeResults: false }, 1, { c: true })

        expect(adobified).toContain('.apply(this,[1,{"c":true}])')
    })

    it('includes a console shim when the source uses console', () => {
        const script = toEs3Script(() => { console.log('hi') })
        const { adobified } = adobify(script, [], { handleErrors: false, writeResults: false })

        expect(adobified).toContain('if (typeof console === \'undefined\')')
    })

    it('prepends includes', () => {
        const script = toEs3Script(() => 1)
        const include = 'var INJECTED = true;'
        const { adobified } = adobify(script, [include], { handleErrors: false, writeResults: false })

        expect(adobified).toContain(include)
        // include must come before the script body
        expect(adobified.indexOf(include)).toBeLessThan(adobified.indexOf('.apply(this,'))
    })

})
