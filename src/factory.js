
import is from 'is-explicit'
import platform from './platform'

/******************************************************************************/
// Defaults
/******************************************************************************/

const { freeze, defineProperty } = Object

const DEFAULT_INCLUDES = freeze([

])

const DEFAULTS = freeze({
  errorHandling: true,
  renderEngine: false,
  programDir: null,
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

function validateBoolean (name, options) {

  const value = options[name]

  const isDefined = is(value)
  if (isDefined && !is(value, Boolean))
    throw new Error(`if defined, options.${name} must be true or false`)

  return isDefined ? value : DEFAULTS[name]
}

function validateString (name, options, enums) {

  const value = options[name]

  const isValid = enums ? enums.includes(value) : true

  if (is(value) && (!is(value, String) || !isValid))
    throw new Error(`if defined, options.${name} must be ${enums ? 'one of ' + enums : 'a string'}`)

  return value || DEFAULTS[name]

}

function validateArray (name, options, Type) {

  const value = options[name]

  const isDefined = is(value)
  const isValid = is(value, Array) && (value.length === 0 || is.arrayOf(value, Type))

  if (isDefined && !isValid)
    throw new Error(`if defined, options.${name} must be an array of ${Type.name}s.`)

  return isDefined ? [ ...value ] : [ ...DEFAULTS[name] ]
}

function validateOptions (options = {}) {

  if (!is.plainObject(options))
    throw new Error('options, if defined, must be a plain object.')

  return Object.freeze({
    errorHandling: validateBoolean('errorHandling', options),
    renderEngine: validateBoolean('renderEngine', options),
    shortcut: validateString('shortcut', options, VALID_SHORTCUTS),
    program: validateString('programDir', options),
    includes: validateArray('includes', options, String)
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

  const { getScriptsDir, ...funcs } = platform

  for (const key in funcs)
    AfterEffects[key] = AfterEffects::funcs[key]

  defineProperty(AfterEffects, 'scriptsDir', { get: getScriptsDir })

  return AfterEffects
}

export { DEFAULT_INCLUDES }
