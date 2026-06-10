import { createRequire } from 'module'

import { Json, ScriptConfig } from './types'
import toEs3Script, { Es3Script } from './to-es3-script'
import { adobify } from './util/transpile'
import { readSync } from './util/fs-util'
import esnextShimSource from './esnext-shim'

/*** Shim ***/

// resolves under both commonjs (tsc output) and esm (vitest)
const requireResolve = createRequire(__filename).resolve

let shim: string | null = null

/**
 * The full shim prepended by prependEsnextShim: the extendscript-es5-shim
 * package providing the es5 baseline (including JSON), followed by our own
 * es3-compatible polyfills for es2015+ library methods.
 */
export function getShim(): string {
    if (shim === null)
        shim = readSync(requireResolve('extendscript-es5-shim')) + '\n' + esnextShimSource

    return shim ?? ''
}

/*** Main ***/

/**
 * Convert a ScriptConfig into the final script text sent to After Effects,
 * applying transpilation, the es5 shim and any custom es3 includes.
 */
export default function buildAdobified<A extends Json[]>(
    config: ScriptConfig<A, Json | void>,
    args: A,
    serializeResult: boolean
) {

    // When targeting the legacy ExtendScript environment, run the source through
    // toEs3Script() which babelifies it to ES3 and splits out babel prefixes.
    // Otherwise pass the raw source so modern JS is left intact.
    const transpile = config.transpileToEs3 ?? true

    const source = config.source.toString()
    const script: Es3Script = transpile
        ? toEs3Script(source)
        : { source, code: ['', `(${source})`], isFunctionExpression: true }

    const includes: string[] = []

    if (config.prependEsnextShim ?? false)
        includes.push(getShim())

    includes.push(...config.prependCustomEs3 ?? [])

    const options = {
        handleErrors: serializeResult,
        writeResults: serializeResult
    }

    return adobify(script, includes, options, ...args)
}
