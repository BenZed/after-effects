import os from 'os'
import uuid from 'uuid'
import path from 'path'

import { transform } from 'babel-core'

import Command from '../command'
import { CODE } from './symbols'

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

/******************************************************************************/
// Exports
/******************************************************************************/

export function babelify (str) {

  try {

    const { code } = transform(str, BABEL_OPTIONS)

    return code

  } catch ({ message }) {

    throw new Error('Source could not be transpiled: ' + message)

  }

}

// This is a big fucker of a function and it probably wont make a lot of sense
// If you're not familiar with the Adobe scripting environment.
// TODO Comment in greater detail.

export function adobify (options = {}, source, ...args) {

  const command = Command.fromSource(source)
  const [ prefixes, babelified ] = command[CODE]

  const { isFunctionExpression } = command

  const { errorHandling } = options

  const resultUrl = isFunctionExpression || errorHandling
    ? path.join(os.tmpdir(), `ae-result-${uuid.v4()}.js`)
    : null

  const lines = []

  // There's probably a better way to do this, but we'll only ensure the global shortcut
  // exists if the babelified code includes the word 'global.'
  if (/global\./.test(babelified)) lines.push(
    '',
    'if (typeof global === \'undefined\')',
    '  global = $.global;'
  )
  // There's probably a better way to do this, but we'll only ensure the node-console
  // object exists if the babelified code includes the word 'console.'
  if (/console\./.test(babelified)) lines.push(
    '',
    'if (typeof console === \'undefined\') {',
    '  $.global.console = {',
    '    _cache: [],',
    '    log: function() { this._cache.concat([].slice.call(arguments)); }',
    '  }',
    '};'
  )

  if (errorHandling || isFunctionExpression) lines.push(
    '',
    '$.sfns = app.preferences.getPrefAsLong(\'Main Pref Section\', \'Pref_SCRIPTING_FILE_NETWORK_SECURITY\') === 1;'
  )

  if (errorHandling) lines.push(
    '',
    'if ($.sfns)',
    '  app.beginSuppressDialogs();'
  )

  if (errorHandling) lines.push(
    '',
    'try {'
  )

  lines.push(
    prefixes
  )

  if (errorHandling && !isFunctionExpression)
    lines.push(
      `$.result = null;`
    )

  if (isFunctionExpression) {
    const strArg = args.length > 0 ? ',' + JSON.stringify(args) : ''
    lines.push(
      `$.result = ${babelified}.apply(this${strArg});`
    )
  } else
    lines.push(
      babelified
    )

  if (errorHandling) lines.push(
    '',
    '} catch (err) {'
  )

  if (errorHandling) lines.push(
    '',
    '  if ($.sfns)',
    '    $.result = err;',
    '  else',
    '    throw new Error(\'Node.js cannot handle errors in After Effects unless "Allow Scripts to Write Files and Access Network" is enabled in "General" settings.\');'
  )

  if (errorHandling) lines.push(
    '}',
    '',
    'if ($.sfns)',
    '  app.endSuppressDialogs(false);'
  )

  if (isFunctionExpression) lines.push(
    '',
    'if ($.result !== undefined && !$.sfns)',
    '  throw new Error(\'Node.js cannot get a response from After Effects unless "Allow Scripts to Write Files and Access Network" is enabled in "General" settings.\');',
    '',
    '$.cache = typeof console === \'object\' && console._cache instanceof Array && console._cache || [];'
  )

  if (!isFunctionExpression && errorHandling) lines.push(
    '',
    'if ($.result) {',
    ''
  )

  if (isFunctionExpression || errorHandling) lines.push(
    `$.file = File('${resultUrl}');`,
    '$.file.open(\'w\');',
    '$.file.write(\'module.exports = \' + ({',
    '  error: $.result instanceof Error ? $.result.message : null,'
  )

  if (isFunctionExpression) lines.push(
    '  logs: $.cache.splice(0, $.cache.length),',
    '  result: $.result instanceof Error ? null : $.result'
  )

  if (isFunctionExpression || errorHandling) lines.push(
    '}.toSource()));',
    '$.file.close();'
  )

  if (!isFunctionExpression && errorHandling) lines.push(
    '',
    '}'
  )

  if (isFunctionExpression || errorHandling) lines.push(
    '',
    'delete $.cache;',
    'delete $.file;',
    'delete $.result;',
    'delete $.sfns;'
  )

  const adobified = lines.join('\n').trim()

  return {
    adobified,
    resultUrl
  }
}
