
import is from 'is-explicit'
import * as api from './api'

/******************************************************************************/
// Defaults
/******************************************************************************/

const { freeze, defineProperty } = Object

const DEFAULT_INCLUDES = freeze([

])

const DEFAULTS = freeze({
  handleErrors: true,
  writeResults: true,
  renderEngine: false,
  programDir: undefined,
  logger: console.log.bind(console),
  shortcut: 'executeSync',
  includes: DEFAULT_INCLUDES
})

/******************************************************************************/
// Validation
/******************************************************************************/

const VALID_SHORTCUTS = [
  'execute', 'executeSync', 'create', 'createSync'
]

// Why define all these validator helper functions? Well, it makes the main
// validate function look cleaner, and I'm not sure how many more options I'm going
// to add.

function validateBoolean (name, options, defs) {

  const value = options[name]

  const isDefined = is(value)
  if (isDefined && !is(value, Boolean))
    throw new Error(`if defined, options.${name} must be true or false`)

  return isDefined ? value : defs[name]
}

function validateFunction (name, options, defs) {

  const value = options[name]

  if (is(value) && !is(value, Function))
    throw new Error(`if defined, options.${name} must be true or false`)

  return value || defs[name]

}

function validateString (name, options, enums, defs) {

  const value = options[name]

  const isValid = enums ? enums.includes(value) : true

  if (is(value) && (!is(value, String) || !isValid))
    throw new Error(`if defined, options.${name} must be ${enums ? 'one of ' + enums : 'a string'}`)

  return value || defs[name]

}

function validateArray (name, options, Type, defs) {

  const value = options[name]

  const isDefined = is(value)
  const isValid = is(value, Array) && (value.length === 0 || is.arrayOf(value, Type))

  if (isDefined && !isValid)
    throw new Error(`if defined, options.${name} must be an array of ${Type.name}s.`)

  return isDefined ? [ ...value ] : [ ...defs.includes ]
}

function validateOptions (options = {}, defs = DEFAULTS) {

  defs = { ...defs } // Rewrap to prevent future setOptions calls from mutating past options

  if (!is.plainObject(options))
    throw new Error('options, if defined, must be a plain object.')

  return Object.freeze({
    handleErrors: validateBoolean('handleErrors', options, defs),
    writeResults: validateBoolean('writeResults', options, defs),
    renderEngine: validateBoolean('renderEngine', options, defs),
    shortcut: validateString('shortcut', options, VALID_SHORTCUTS, defs),
    programDir: validateString('programDir', options, null, defs),
    logger: validateFunction('logger', options, defs),
    includes: validateArray('includes', options, String, defs)
  })

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default function factory (options = {}) { // Factory

  // It actually doesn't need to be invoked with new at all, but lets enforce some readability.
  if (!is(this))
    throw new Error('Class constructor AfterEffects cannot be invoked without \'new\'')

  function AfterEffects (...args) { // Instance

    const { shortcut: method } = AfterEffects.options

    return AfterEffects[method](...args)

  }

  AfterEffects.options = validateOptions(options)
  AfterEffects.setOptions = options => validateOptions(options, AfterEffects.options)

  defineProperty(AfterEffects, 'scriptsDir', { get: AfterEffects::api.getScriptsDirSync })

  for (const key in api)
    AfterEffects[key] = AfterEffects::api[key]

  return AfterEffects
}

export { DEFAULT_INCLUDES }
