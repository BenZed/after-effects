// import os from 'os'
// import fs from 'fs'
// import path from 'path'
// import uuid from 'uuid'
// import settings from './settings'
// import Command from './command'
// import ERRORS from './errors'
import is from 'is-explicit'

/******************************************************************************/
// Data
/******************************************************************************/

import path from 'path'

/******************************************************************************/
// Data
/******************************************************************************/

const DEFAULTS = {
  errorHandling: true,
  program: null,
  includes: [
    // path.join(__dirname, '/lib/includes/console.js'),
    // path.join(__dirname, '/lib/includes/extendscript-es5-shim.js'),
    // path.join(__dirname, '/lib/includes/get.js')
  ]
}

/******************************************************************************/
// Helper
/******************************************************************************/

function validateOptions (options = {}) {

  if (!is.plainObject(options))
    throw new Error('options must be a plain object.')

  const { errorHandling, program, includes } = options

  if (is(errorHandling) && !is(errorHandling, Boolean))
    throw new Error('if defined, options.errorHandling must be true or false.')

  if (is(program) && !is(program, String))
    throw new Error('if defined, options.program must be a string.')

  const includesDefined = is(includes)

  if (includesDefined && !is.arrayOf(includes, String))
    throw new Error('if defined, options.include must be an array of strings.')

  return Object.freeze({
    errorHandling: errorHandling || DEFAULTS.errorHandling,
    program: program || DEFAULTS.program,
    includes: includesDefined ? [ ...includes ] : [ ...DEFAULTS.includes ]
  })

}

/******************************************************************************/
// Main
/******************************************************************************/

function execute (source, ...args) { console.log('execute') }

function executeSync (source, ...args) { console.log('executeSync') }

function create (source, ...args) { console.log('create') }

function createSync (source, ...args) { console.log('createSync') }

/******************************************************************************/
// Exports
/******************************************************************************/

export default function factory (options = {}) { // Factory

  // It actually doesn't need to be invoked with new at all, but lets enforce some readability.
  if (!is(this))
    throw new Error('Class constructor AfterEffects cannot be invoked without \'new\'')

  function AfterEffects (...args) { // Instance
    AfterEffects.executeSync(...args)
  }

  AfterEffects.options = validateOptions(options)

  AfterEffects.execute = execute
  AfterEffects.create = create

  AfterEffects.executeSync = executeSync
  AfterEffects.createSync = createSync

  return AfterEffects
}
