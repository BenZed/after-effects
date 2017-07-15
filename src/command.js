import fs from 'fs'
import is from 'is-explicit'
import isPath from 'is-valid-path'

import { CODE, SOURCE } from './util/symbols'

import transpile from './util/transpile'

/******************************************************************************/
// Helper
/******************************************************************************/

function tryReadFile (url) {

  try {
    return fs.readFileSync(url, 'utf-8')
  } catch (err) {
    // Prettier error than ENONENT or whatever
    throw new Error(`Could not read ${url}. Ensure it that it is a valid file url and that you have permissions.`)
  }
}

function inputToSource (input) {

  if (is(input, Function))
    return input.toString()

  // Dunno why the fuck someone would want to create a command
  // from an existing command, but whatever
  if (is(input, Command))
    return input[SOURCE]

  // If string is a path, try and read the file it's a path to.
  if (isPath(input))
    return tryReadFile(input)

  // whatever other string it is better be valid code
  if (is(input, String))
    return input

  throw new Error('Commands must be created with functions, urls to code files or blobs of code as a string')

}

function codify (source) {

  // Pass source function as an expression otherwise it will break when being isolated
  const transpiled = transpile(`(${source})`)

  // Isolate babelified code to just the function expression (remove babel prefixes and the final ;)
  const funcStart = transpiled
    .indexOf('(function')
  const funcExpression = transpiled
    .substring(funcStart, transpiled.length - 1)

  // Isolate the babel prefixes and remove the 'use strict' directive. (After Effects doesn't use it)
  const babelPrefixes = transpiled
    .substring(0, funcStart)
    .replace(/'use\sstrict';(\n)/, '')
    .trim()

  return [ babelPrefixes, funcExpression ]

}

/******************************************************************************/
// Exportsr
/******************************************************************************/

export default class Command {

  static fromSource (source) {

    return is(source, Command)
      ? source
      : new Command(source)

  }

  constructor (input) {

    const source = inputToSource(input)

    this[SOURCE] = source
    this[CODE] = codify(source)

  }

  toString () {
    return this[CODE][1]
  }

}
