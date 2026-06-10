import { randomUUID } from 'crypto'
import { createRequire } from 'module'
import path from 'path'

import { transformSync, TransformOptions } from '@babel/core'

import { CMD_RES_DIR, escaped } from '../api/common'
import { Es3Script } from '../to-es3-script'

// Data

// resolves under both commonjs (tsc output) and esm (vitest)
const requireModule = createRequire(__filename)

const BABEL_OPTIONS: TransformOptions = {

    presets: [
        [requireModule('@babel/preset-env'), {
            // The ExtendScript engine inside After Effects is ES3. ie 8 is the
            // oldest target preset-env supports and covers the same transforms
            // the old es2015 + es3-literal plugin stack did.
            targets: { ie: '8' },
            modules: false
        }]
    ],
    plugins: [
        // getters/setters in object literals don't exist in ES3
        requireModule('@babel/plugin-transform-property-mutators')
    ],
    sourceType: 'script',
    compact: false,

    // never pick up babel config from the host project
    babelrc: false,
    configFile: false

}

// Exports

export function babelify(str: string) {

    try {

        const result = transformSync(str, BABEL_OPTIONS)
        return result?.code ?? ''

    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        throw new Error('Source could not be transpiled: ' + message)
    }

}

// This is a big fucker of a function and it probably wont make a lot of sense
// If you're not familiar with the Adobe scripting environment.

export interface AdobifyOptions {
    handleErrors?: boolean
    writeResults?: boolean
}

export function adobify(command: Es3Script, includes: string[], options: AdobifyOptions = {}, ...scriptArgs: any[]) {

    const [prefixes, babelified] = command.code

    const { isFunctionExpression } = command

    const { handleErrors, writeResults } = options

    const doErrorHandling = handleErrors
    const doResultWriting = isFunctionExpression && writeResults

    const resultUrl = doResultWriting || doErrorHandling
        ? path.join(CMD_RES_DIR, `ae-result-${randomUUID()}.js`)
        : null

    const lines = []

    if (doErrorHandling || doResultWriting) lines.push(
        '$.nodeJS = {',
        '  sfns: app.preferences.getPrefAsLong(\'Main Pref Section\', \'Pref_SCRIPTING_FILE_NETWORK_SECURITY\') === 1,',
        '};'
    )

    if (doErrorHandling) lines.push(
        '',
        'if ($.nodeJS.sfns)',
        '  app.beginSuppressDialogs();',
        '',
        'try {'
    )

    // There's probably a better way to do this, but we'll only ensure the global shortcut
    // exists if the babelified code includes the word 'global'
    if (/global/.test(babelified)) lines.push(
        '',
        'if (typeof global === \'undefined\')',
        '  global = $.global;'
    )
    // There's probably a better way to do this, but we'll only ensure the node-console
    // object exists if the babelified code includes the word 'console'
    if (/console/.test(babelified)) lines.push(
        '',
        'if (typeof console === \'undefined\') {',
        '  console = {',
        '    _cache: [],',
        '    log: function() { this._cache.push([].slice.call(arguments)); }',
        '  }',
        '};'
    )

    lines.push(
        prefixes,
        ...includes
    )

    if (isFunctionExpression) {
        const strArg = JSON.stringify(scriptArgs)
        lines.push(
            `${doResultWriting ? '$.nodeJS.result = ' : ''}${babelified}.apply(this,${strArg});`
        )
    } else
        lines.push(
            babelified
        )

    if (doErrorHandling) lines.push(
        '',
        '} catch (err) {',
        '  $.nodeJS.result = err;',
        '}',
        '',
        'if ($.nodeJS.sfns)',
        '  app.endSuppressDialogs(false);'
    )

    if (doResultWriting || doErrorHandling) lines.push(
        '',
        'if ($.nodeJS.sfns) {',
        ''
    )

    if (doResultWriting) lines.push(
        '  $.nodeJS.logs = typeof console === \'object\' && console._cache instanceof Array && console._cache || [];'
    )

    if ((doResultWriting || doErrorHandling) && resultUrl) lines.push(
        `  $.nodeJS.file = File('${escaped(resultUrl)} ');`,
        '  $.nodeJS.file.open(\'w\');',
        '  $.nodeJS.file.write(\'module.exports = \' + ({',
        '    error: $.nodeJS.result instanceof Error ? { message: $.nodeJS.result.message, stack: $.nodeJS.result.stack } : null,'
    )

    if (doResultWriting) lines.push(
        '    logs: $.nodeJS.logs.splice(0, $.nodeJS.logs.length),', // splice so that the console.log._cache is cleared
        '    result: $.nodeJS.result instanceof Error ? null : $.nodeJS.result'
    )

    const errDescription = (doResultWriting ? 'get results' : '') +
        (doResultWriting && doErrorHandling ? ' or ' : '') +
        (doErrorHandling ? 'handle errors' : '')

    if (doResultWriting || doErrorHandling) lines.push(
        '  }.toSource()));',
        '  $.nodeJS.file.close();',
        '',
        `} else alert('NodeJS Error\\nCannot ${errDescription} from ` +
        'After Effects unless "Preferences" > "General" > "Allow Scripts' +
        ' to Write Files and Access Network" is enabled.\')',
        '',
        'delete $.nodeJS;'
    )

    const adobified = lines.join('\n').trim()

    return {
        adobified,
        resultUrl
    }
}
