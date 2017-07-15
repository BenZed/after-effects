import os from 'os'
// import fs from 'fs'
import path from 'path'
// import uuid from 'uuid'
// import settings from './settings'
import Command from './command'
// import ERRORS from './errors'
import is from 'is-explicit'
import { CODE, RESULT } from './util/symbols'
import uuid from 'uuid'

/******************************************************************************/
// Data
/******************************************************************************/

const { freeze, defineProperty } = Object

const DEFAULT_INCLUDES = freeze([

])

const DEFAULTS = freeze({
  errorHandling: true,
  renderEngine: false,
  expectResult: true,
  program: null,
  shortcut: 'executeSync',
  includes: DEFAULT_INCLUDES
})

const VALID_SHORTCUTS = [
  'execute', 'executeSync', 'create', 'createSync'
]

/******************************************************************************/
// Helper
/******************************************************************************/

function validateOptions (options = {}) {

  if (!is.plainObject(options))
    throw new Error('options must be a plain object.')

  const { errorHandling, renderEngine, program, includes, shortcut } = options

  const errorHandlingDefined = is(errorHandling)
  if (errorHandlingDefined && !is(errorHandling, Boolean))
    throw new Error('if defined, options.errorHandling must be true or false.')

  const renderEngineDefined = is(renderEngine)
  if (renderEngineDefined && !is(renderEngine, Boolean))
    throw new Error('if defined, options.renderEngine must be true or false.')

  if (is(program) && !is(program, String))
    throw new Error('if defined, options.program must be a string.')

  const includesDefined = is(includes)
  const includesIsValidArray = is(includes, Array) && (includes.length === 0 || is.arrayOf(includes, String))

  if (includesDefined && !includesIsValidArray)
    throw new Error('if defined, options.include must be an array of strings.')

  if (is(shortcut) && !VALID_SHORTCUTS.includes(shortcut))
    throw new Error('if defined, options.shortcut must be one of ' + VALID_SHORTCUTS.map(shortcut => `'${shortcut}'`))

  return Object.freeze({
    errorHandling: errorHandlingDefined ? errorHandling : DEFAULTS.errorHandling,
    renderEngine: renderEngineDefined ? renderEngine : DEFAULTS.renderEngine,
    shortcut: shortcut || DEFAULTS.shortcut,
    program: program || DEFAULTS.program,
    includes: includesDefined ? [ ...includes ] : [ ...DEFAULTS.includes ]
  })

}

function stringify (source, ...args) {

  const command = Command.fromSource(source)
  const [ prefixes, main ] = command[CODE]

  const resultPath = path.join(os.tmpdir(), `ae-result-${uuid.v4()}.json`)

  const { errorHandling } = this.options

  const lines = [
    prefixes
  ]

  if (errorHandling) lines.push(
    'app.beginSuppressDialogs();',
    'try {'
  )

  lines.push(
    '$.result = ' + main + '.apply(this'
  )

  if (args.length > 0)
    lines.push(',' + JSON.stringify(args))

  lines.push(
    ');'
  )

  if (errorHandling) lines.push(
    '} catch (err) {',
    '  $.result = err',
    '}',
    'app.endSuppressDialogs(false);'
  )


  const string = lines.join('\n')

  return [ string, resultPath]
}

/******************************************************************************/
// Main
/******************************************************************************/

function executeSync (source, ...args) {

  const string = this::stringify(source, ...args)

}

function createSync (source, ...args) { console.log('createSync') }

async function execute (source, ...args) { console.log('execute') }

async function create (source, ...args) { console.log('create') }

/******************************************************************************/
// Exports
/******************************************************************************/

export default function factory (options = {}) { // Factory

  // It actually doesn't need to be invoked with new at all, but lets enforce some readability.
  if (!is(this))
    throw new Error('Class constructor AfterEffects cannot be invoked without \'new\'')

  function AfterEffects (...args) { // Instance

    const { shortcut: method } = AfterEffects.options
    AfterEffects[method](...args)

  }

  AfterEffects.options = validateOptions(options)

  AfterEffects.execute = AfterEffects::execute
  AfterEffects.create = AfterEffects::create

  AfterEffects.executeSync = AfterEffects::executeSync
  AfterEffects.createSync = AfterEffects::createSync

  defineProperty(AfterEffects, 'scriptsDir', {
    get () { throw new Error('get scriptsDir not yet implemented.') }
  })

  return AfterEffects
}

export { DEFAULT_INCLUDES }
