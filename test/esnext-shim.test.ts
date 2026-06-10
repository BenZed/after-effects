import { describe, it, expect, beforeAll } from 'vitest'

import vm from 'vm'

import { getShim } from '../src/build-adobified'
import esnextShimSource from '../src/esnext-shim'

// Run the shim in a sandbox where the modern natives have been deleted,
// simulating an engine that lacks them, then evaluate expressions against
// the polyfilled environment.
function createShimmedContext() {

    const context = vm.createContext({})

    vm.runInContext(`
        delete Object.assign
        delete Object.values
        delete Object.entries
        delete Object.fromEntries
        delete Array.of
        delete Array.from
        delete Array.prototype.find
        delete Array.prototype.findIndex
        delete Array.prototype.findLast
        delete Array.prototype.findLastIndex
        delete Array.prototype.includes
        delete Array.prototype.fill
        delete Array.prototype.flat
        delete Array.prototype.flatMap
        delete Array.prototype.at
        delete String.prototype.includes
        delete String.prototype.startsWith
        delete String.prototype.endsWith
        delete String.prototype.repeat
        delete String.prototype.padStart
        delete String.prototype.padEnd
        delete String.prototype.trimStart
        delete String.prototype.trimEnd
        delete String.prototype.at
        delete String.prototype.replaceAll
        delete Number.isNaN
        delete Number.isFinite
        delete Number.isInteger
        delete Number.isSafeInteger
        delete Number.parseInt
        delete Number.parseFloat
        delete Math.trunc
        delete Math.sign
        delete Math.cbrt
        delete Math.log2
        delete Math.log10
        delete Math.hypot
    `, context)

    vm.runInContext(getShim(), context)

    return (expression: string) => vm.runInContext(expression, context)
}

describe('esnext shim source', () => {

    it('contains no es2015+ syntax', () => {
        expect(esnextShimSource).not.toContain('=>')
        expect(esnextShimSource).not.toMatch(/\bconst\b/)
        expect(esnextShimSource).not.toMatch(/\blet\b/)
        expect(esnextShimSource).not.toMatch(/\bclass\b/)
        expect(esnextShimSource).not.toMatch(/`/)
    })

})

describe('esnext shim behavior', () => {

    let run: (expression: string) => any

    beforeAll(() => {
        run = createShimmedContext()
    })

    it('Object.assign', () => {
        expect(run('Object.assign({}, {a: 1}, {b: 2})')).toEqual({ a: 1, b: 2 })
    })

    it('Object.values / entries / fromEntries', () => {
        expect(run('Object.values({a: 1, b: 2})')).toEqual([1, 2])
        expect(run('Object.entries({a: 1})')).toEqual([['a', 1]])
        expect(run('Object.fromEntries([["a", 1], ["b", 2]])')).toEqual({ a: 1, b: 2 })
    })

    it('Array.of / Array.from', () => {
        expect(run('Array.of(1, 2, 3)')).toEqual([1, 2, 3])
        expect(run('Array.from({length: 3}, function (v, i) { return i * 2 })')).toEqual([0, 2, 4])
        expect(run('Array.from("abc")')).toEqual(['a', 'b', 'c'])
    })

    it('Array.prototype.find / findIndex / findLast / findLastIndex', () => {
        expect(run('[1, 2, 3, 4].find(function (n) { return n > 2 })')).toBe(3)
        expect(run('[1, 2, 3, 4].findIndex(function (n) { return n > 2 })')).toBe(2)
        expect(run('[1, 2, 3, 4].findLast(function (n) { return n < 4 })')).toBe(3)
        expect(run('[1, 2, 3, 4].findLastIndex(function (n) { return n < 4 })')).toBe(2)
        expect(run('[1].find(function () { return false })')).toBeUndefined()
    })

    it('Array.prototype.includes, with NaN SameValueZero semantics', () => {
        expect(run('[1, 2, 3].includes(2)')).toBe(true)
        expect(run('[1, 2, 3].includes(4)')).toBe(false)
        expect(run('[1, NaN].includes(NaN)')).toBe(true)
        expect(run('[1, 2, 3].includes(1, 1)')).toBe(false)
    })

    it('Array.prototype.fill / flat / flatMap / at', () => {
        expect(run('[1, 2, 3].fill(0, 1)')).toEqual([1, 0, 0])
        expect(run('[1, [2, [3, [4]]]].flat()')).toEqual([1, 2, [3, [4]]])
        expect(run('[1, [2, [3, [4]]]].flat(Infinity)')).toEqual([1, 2, 3, 4])
        expect(run('[1, 2].flatMap(function (n) { return [n, n * 10] })')).toEqual([1, 10, 2, 20])
        expect(run('[1, 2, 3].at(-1)')).toBe(3)
        expect(run('[1, 2, 3].at(5)')).toBeUndefined()
    })

    it('String.prototype additions', () => {
        expect(run('"hello world".includes("world")')).toBe(true)
        expect(run('"hello".startsWith("he")')).toBe(true)
        expect(run('"hello".endsWith("lo")')).toBe(true)
        expect(run('"ab".repeat(3)')).toBe('ababab')
        expect(run('"5".padStart(3, "0")')).toBe('005')
        expect(run('"5".padEnd(3, "0")')).toBe('500')
        expect(run('"  hi  ".trimStart()')).toBe('hi  ')
        expect(run('"  hi  ".trimEnd()')).toBe('  hi')
        expect(run('"abc".at(-1)')).toBe('c')
        expect(run('"a-b-c".replaceAll("-", "_")')).toBe('a_b_c')
    })

    it('Number additions', () => {
        expect(run('Number.isInteger(5)')).toBe(true)
        expect(run('Number.isInteger(5.5)')).toBe(false)
        expect(run('Number.isNaN(NaN)')).toBe(true)
        expect(run('Number.isNaN("NaN")')).toBe(false)
        expect(run('Number.isFinite(5)')).toBe(true)
        expect(run('Number.isFinite(Infinity)')).toBe(false)
        expect(run('Number.isSafeInteger(9007199254740991)')).toBe(true)
        expect(run('Number.isSafeInteger(9007199254740992)')).toBe(false)
        expect(run('Number.parseInt("42px")')).toBe(42)
        expect(run('Number.parseFloat("3.14abc")')).toBe(3.14)
    })

    it('Math additions', () => {
        expect(run('Math.trunc(4.7)')).toBe(4)
        expect(run('Math.trunc(-4.7)')).toBe(-4)
        expect(run('Math.sign(-3)')).toBe(-1)
        expect(run('Math.sign(0)')).toBe(0)
        expect(run('Math.cbrt(27)')).toBeCloseTo(3)
        expect(run('Math.cbrt(-8)')).toBeCloseTo(-2)
        expect(run('Math.log2(8)')).toBeCloseTo(3)
        expect(run('Math.log10(1000)')).toBeCloseTo(3)
        expect(run('Math.hypot(3, 4)')).toBeCloseTo(5)
    })

})
