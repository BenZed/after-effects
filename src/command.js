import fs from 'fs'
import path from 'path'
import is from 'is-explicit'

import { CODE, SOURCE } from './util/symbols'

import transpile from './util/transpile'

/******************************************************************************/
// Helper
/******************************************************************************/

function codify (source) {

  const transpiled = transpile(source)

  return transpiled

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default class Command {

  constructor (func) {

    if (!is(func, Function))
      throw new Error('Commands must be constructed with a function to send to After Effects.')

    const source = func.toString()

    this[source] = source
    this[CODE] = codify(source)

  }

  toString () {
    return this[CODE]
  }

}
