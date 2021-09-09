import uuid from 'uuid'
import path from 'path'

import { transform } from 'babel-core'

import { CODE } from './symbols'
import { CMD_RES_DIR, escaped } from '../api/common'

/******************************************************************************/
// Data
/******************************************************************************/

const BABEL_OPTIONS = {

  presets: [
    require('babel-preset-es2015')
  ],
  plugins: [
    require('babel-plugin-transform-es3-member-expression-literals'),
    require('babel-plugin-transform-es3-property-literals'),
    require('babel-plugin-transform-es5-property-mutators')
  ],
  // generatorOpts: {
  //   quotes: 'single'
  // },
  sourceType: 'script',
  minified: false

}

// Exports

export function babelify(str: string) {

  try {

    const { code } = transform(str, BABEL_OPTIONS)

    return code

  } catch ({ message }) {

    throw new Error('Source could not be transpiled: ' + message)

  }

}

// This is a big fucker of a function and it probably wont make a lot of sense
// If you're not familiar with the Adobe scripting environment.

export function adobify(command, includes, options = {}, ...args) {

  const [prefixes, babelified] = command[CODE]

  const { isFunctionExpression } = command

  const { handleErrors, writeResults } = options

  const doErrorHandling = handleErrors
  const doResultWriting = isFunctionExpression && writeResults

  const resultUrl = doResultWriting || doErrorHandling
    ? path.join(CMD_RES_DIR, `ae-result-${uuid.v4()}.js`)
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
    const strArg = JSON.stringify(args)
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

  if (doResultWriting || doErrorHandling) lines.push(
    `  $.nodeJS.file = File('${escaped.call(resultUrl)} ');`,
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
