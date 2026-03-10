import isPath from 'is-valid-path'

import { babelify } from './util/transpile'
import { readSync } from './util/fs-util'

// Helper

export function inputToSource(input: Function | toEs3Script | string): string {

    let source = null

    if (typeof input === 'function')
        source = input.toString()

    else if (input instanceof toEs3Script)
        source = (input as toEs3Script).source

    // If string is a path, try and read the file it's a path to.
    else if (isPath(input))
        source = readSync(input as string)

    // whatever other string it is better be valid code
    else
        source = input

    if (typeof source !== 'string')
        throw new Error('must be created with functions, urls to code files or blobs of code as a string')

    // If we're trying to use a js file that exports a single function as a source
    // we'll remove the export default so it doesn't break.
    // TODO there are probably a lot of cases this regeex doesn't support, such
    // as module.exports
    source = source.replace(/^(\s+)?export\s+default/, '')

    return source

}

function codify(isFunctionExpression: boolean, source: string) {

    // Source must be evaluated in parenthesis if we're making a function expression
    // otherwise this will break.
    source = isFunctionExpression ? `(${source})` : source

    let prefixes = ''

    let babelified = babelify(source) ?? ''

    if (isFunctionExpression) {

        const funcStart = babelified
            .indexOf('(function')

        // Isolate the babel prefixes and remove the 'use strict' directive. (After Effects doesn't use it)
        prefixes = babelified
            .substring(0, funcStart)
            .replace(/'use\sstrict';(\n)/, '')
            .trim()

        // Isolate babelified code to just the function expression (remove babel prefixes and the final ;)
        babelified = babelified
            .substring(funcStart, babelified.length - 1)

    }

    return [prefixes, babelified]
}

function autoDetectFunctionExpression(source: string) {
    // Remove doubled whitespace
    source = source
        .replace(/\s\s/g, ' ')
        .replace(/\s\s/g, ' ') // twice, to catch odd numbers
        .trim()

    // TODO there are a lot of cases this doesn't support. Do some testing and add more.
    const result =
        // Test if Arrow Function
        /^\(((\w| |\d|,)+)?\)\s?=>/.test(source) ||
        // Test if function keyword
        /^function\s?\(((\w| |\d|,)+)?\)\s?{/.test(source)

    return result
}

// Exports

export default class toEs3Script {

    static fromSource(source: string, isFunctionExpression?: boolean) {

        return source instanceof toEs3Script
            ? source
            : new toEs3Script(source, isFunctionExpression)

    }

    readonly source: string

    readonly code: string[]

    readonly isFunctionExpression: boolean

    constructor(input: string | Function | toEs3Script, isFunctionExpression?: boolean) {

        const source = inputToSource(input)

        // if the source is a function, then this command is definetly a function
        // expression
        isFunctionExpression = typeof input === 'function'
            ? true

            // otherwise, if an argument was explicitly defined, that will determine
            // if the source is a function expression
            : typeof isFunctionExpression === 'boolean'
                ? isFunctionExpression

                // Otherwise we try to auto detect
                : autoDetectFunctionExpression(source) // eslint-disable-line indent

        this.source = source
        this.code = codify(isFunctionExpression, source)
        this.isFunctionExpression = isFunctionExpression
    }

    toString() {
        return this.code[1] ?? ''
    }

}
