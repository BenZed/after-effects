import { describe, it, expect } from 'vitest'

import toEs3Script, { inputToSource } from '../src/to-es3-script'

describe('inputToSource', () => {

    it('stringifies functions', () => {
        const source = inputToSource(function add(a: number, b: number) { return a + b })
        expect(source).toContain('a + b')
    })

    it('unwraps objects with a source function', () => {
        const source = inputToSource({ source: (() => 1).toString(), code: ['', ''], isFunctionExpression: true })
        expect(typeof source).toBe('string')
    })

    it('unwraps objects whose source is itself a function', () => {
        // a ScriptConfig-shaped object must not throw
        const source = inputToSource({ source: ((x: number) => x * 2) } as any)
        expect(source).toContain('x * 2')
    })

    it('strips export default from code blobs', () => {
        const source = inputToSource('export default function () { return 1 }')
        expect(source.trim().startsWith('function')).toBe(true)
    })

    it('passes through plain code strings', () => {
        expect(inputToSource('app.quit()')).toBe('app.quit()')
    })

})

describe('toEs3Script', () => {

    it('transpiles arrow functions to es3 function expressions', () => {
        const script = toEs3Script((a: number, b: number) => a + b)
        const [, body] = script.code

        expect(script.isFunctionExpression).toBe(true)
        expect(body).not.toContain('=>')
        expect(body).toContain('function')
        expect(body).toContain('a + b')
    })

    it('transpiles const/let to var', () => {
        const script = toEs3Script(() => {
            const x = 1
            let y = 2
            return x + y
        })
        const [, body] = script.code

        expect(body).not.toMatch(/\bconst\b/)
        expect(body).not.toMatch(/\blet\b/)
        expect(body).toMatch(/\bvar\b/)
    })

    it('detects function expressions in strings', () => {
        const script = toEs3Script('function (a, b) { return a * b }')
        expect(script.isFunctionExpression).toBe(true)
    })

    it('treats statement blobs as non-expressions', () => {
        const script = toEs3Script('var x = 1; x + 1;')
        expect(script.isFunctionExpression).toBe(false)
    })

    it('respects an explicit isFunctionExpression argument', () => {
        const script = toEs3Script('var x = 1;', false)
        expect(script.isFunctionExpression).toBe(false)
    })

    it('strips the use strict directive', () => {
        const script = toEs3Script(() => 1)
        const [prefixes, body] = script.code
        expect(prefixes).not.toContain('use strict')
        expect(body).not.toContain('use strict')
    })

})
