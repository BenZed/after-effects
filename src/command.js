import fs from 'fs'
import path from 'path'
import babel from 'babel-core'
import is from 'is-explicit'
import isPath from 'is-valid-path'
import settings from './settings'
import { execute, executeSync } from './index'

/******************************************************************************/
// Command Specific Configs
/******************************************************************************/

const BabelOptions = {
  presets: [
    require('babel-preset-es2015')
  ],
  plugins: [
    require('babel-plugin-transform-es3-member-expression-literals'),
    require('babel-plugin-transform-es3-property-literals'),
    require('babel-plugin-transform-es5-property-mutators')
  ],
  sourceRoot: __dirname
}

/******************************************************************************/
// Helper
/******************************************************************************/

function parseSource(input) {

  if (is(input, Function))
    return input.toString()

  //Dunno why the fuck someone would want to create a command
  //from an existing command, but whatever
  else if (is(input, Command))
    return input.source

  if (isPath(input))
    return readFile(input, /\.json$/.test(input))

  else if (is(input, String))
    //whatever other string it is better be valid code
    return input

  else
    throw new Error('Commands must be created with functions, urls to json, urls to code files or blobs of code as a string')

}

function readFile(url, toJson) {

  const data = tryReadFile(url)
  return toJson ? tryParseJson(data) : data
}

function tryReadFile(url) {

  try {
    return fs.readFileSync(url, 'utf-8')
  } catch (err) {
    //Prettier error than ENONENT or whatever
    throw new Error(`Could not read ${url}. Ensure it that it is a valid file url and that you have permissions.`)
  }
}

function tryParseJson(data) {
  let json
  try {
    json = JSON.parse(data)
  } catch (err) {
    throw new Error('Could not parse supplied JSON file.')
  }

  if (!json || !is(json.code, String) || !is(json.source, String) || !is(json.options, Object))
    throw new Error('Supplied JSON file is not a serialized Command object.')

  return json
}

/******************************************************************************/
// Command Class
/******************************************************************************/

//Symbols for "private" keys
const compile = Symbol('compile'),
  code        = Symbol('code'),
  source      = Symbol('source'),
  options     = Symbol('options')

export default class Command {

  constructor(source, options) {

    this[source] = parseSource(source)
    this[compile](options)

  }

  /**** "PRIVATE" API ****/

  [compile](options) {
    //if this[source] is an object, it means that parse input returned the results
    //of a json file that represents a serialized command Object so we'll create
    //the command internals from that instead
    if (is(this[source], Object)) {
      const json = this[source]
      this[code] = json.code
      this[source] = json.source
      this[options] = json.options

      return
    }

    if (!is(options, Object))
      options = {}

    if (!options.includes)
      options.includes = [...settings.includes]

    this[options] = options
  }

  /**** MAIN API ****/

  get source() {
    return this[source]
  }

  get options() {
    const options = Object.assign({}, this[options])
    return Object.freeze(options)
  }

  setOptions(value) {

    if (!is(value, Object))
      value = {}

    let needs_recompile = false

    const new_includes = value.includes ? value.includes.sort() : []
    const curr_includes = (this[options].includes || settings.includes).sort()

    if (new_includes.length !== curr_includes.length)
      needs_recompile = true

    else for (let i = 0; i < new_includes.length; i++) {
      if (new_includes[i] !== curr_includes[i]) {
        needs_recompile = true
        break
      }
    }

    if (needs_recompile)
      this[compile](value)
    else
      this[options] = Object.freeze(value)

  }

  execute(...args) {

  }

  executeSync(...args) {

  }

  toString() {
    return ''
  }

  serialize(url) {

  }

}
