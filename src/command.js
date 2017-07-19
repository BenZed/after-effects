import is from 'is-explicit'
import isPath from 'is-valid-path'

import { CODE, SOURCE } from './util/symbols'
import { readSync } from './util/fs-util'
import { babelify } from './util/transpile'

/******************************************************************************/
// Helper
/******************************************************************************/

function inputToSource (input) {

  let source = null

  if (is(input, Function))
    source = input.toString()

  // Dunno why the fuck someone would want to create a command
  // from an existing command, but whatever
  else if (is(input, Command))
    source = input[SOURCE]

  // If string is a path, try and read the file it's a path to.
  else if (isPath(input))
    source = readSync(input)

  // whatever other string it is better be valid code
  else if (is(input, String))
    source = input

  if (source === null)
    throw new Error('Commands must be created with functions, urls to code files or blobs of code as a string')

  // If we're trying to use a js file that exports a single function as a source
  // we'll remove the export default so it doesn't break.
  // TODO there are probably a lot of cases this regeex doesn't support, such
  // as module.exports
  source = source.replace(/^\s?export\s+default/, '')

  return source

}

function codify (isFunctionExpression, source) {

  // Source must be evaluated in parenthesis if we're making a function expression
  // otherwise this will break.
  source = isFunctionExpression ? `(${source})` : source

  let prefixes = ''

  let babelified = babelify(source)

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

  return [ prefixes, babelified ]

}

function autoDetectFunctionExpression (source) {
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

/******************************************************************************/
// Exportsr
/******************************************************************************/

export default class Command {

  static fromSource (source, isFunctionExpression) {

    return is(source, Command)
      ? source
      : new Command(source, isFunctionExpression)

  }

  constructor (input, isFunctionExpression) {

    const source = inputToSource(input)

    // if the source is a function, then this command is definetly a function
    // expression
    isFunctionExpression = is(input, Function) ? true

      // otherwise, if an argument was explicitly defined, that will determine
      // if the source is a function expression
      : is(isFunctionExpression, Boolean) ? isFunctionExpression

      // Otherwise we try to auto detect
      : autoDetectFunctionExpression(source) // eslint-disable-line indent

    this[SOURCE] = source
    this[CODE] = codify(isFunctionExpression, source)

    Object
      .defineProperty(this, 'isFunctionExpression', { value: isFunctionExpression })

  }

  toString () {
    return this[CODE][1]
  }

}
