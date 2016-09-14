import fs from 'fs'
import path from 'path'
import babel from 'babel-core'
import is from 'is-explicit'
import isPath from 'is-valid-path'
import settings from './settings'
import platform from './platform'
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

function babelify(str) {
  return babel.transform(str, BabelOptions).code
}

function babelify_files(includes) {
  if (!is(includes, Array)) return []

  return includes.map(file => {

    try {

      fs.accessSync(path.resolve(file), fs.R_OK)

    } catch (err) {

      throw new Error(`Cannot include file at path ${file}, non-existent or can't be read.`)

    }

    let code = fs.readFileSync(file, { encoding: 'utf-8' })

    //Do not babelify files if they are .jsx. See the README about After Effects .jsx file
    //format and why it shouldn't be transformed
    if (path.extname(file) !== '.jsx')
      code = babelify(code)

    return code

  }).filter(inc => is(inc,String))
}

/******************************************************************************/
// Command Class
/******************************************************************************/

//Symbols for "private" keys
const _compile = Symbol('compile'),
  _code        = Symbol('code'),
  _source      = Symbol('source'),
  _options     = Symbol('options')

export default class Command {

  constructor(source, options) {

    this[_source] = parseSource(source)
    this[_compile](options)

  }

  /**** "PRIVATE" API ****/

  [_compile](options) {
    //if this[_source] is an object, it means that parse input returned the results
    //of a json file that represents a serialized command Object so we'll create
    //the command internals from that instead
    if (is(this[_source], Object)) {
      const json = this[_source]
      this[_code] = json.code
      this[_source] = json.source
      this[_options] = json.options

      //if a json url was provided with options, they'll override the options
      //stored in the json
      if (is(options, Object))
        this.setOptions(options)

      return
    }

    //Apply Options
    if (!is(options, Object))
      options = {}

    this[_options] = Object.assign({}, settings, options)

    //Babelify Code
    const babelified = babelify(this[_source])

    //Isolate babelified code to just the function expression (remove any babelified includes and the final ;)
    const funcStart = babelified.indexOf('(function')
    const code = babelified.substring(funcStart, babelified.length - 1)

    //Isolate funtions created by babel (without the "use strict" cause AE doesn't use it)
    const babel_includes = babelified.substring('0', funcStart).replace('"use strict";\n', '')

    //Babelify each of the files in the include options, and extract the code from them
    const includes = babelify_files(this[_options].includes)

    this[_code] = [...includes, babel_includes, code]
  }

  /**** MAIN API ****/

  get source() {
    return this[_source]
  }

  get options() {
    const options = Object.assign({}, this[_options])
    return Object.freeze(options)
  }

  setOptions(value) {

    if (!is(value, Object))
      value = {}

    let needs_recompile = false

    const new_includes = value.includes ? value.includes.sort() : []
    const curr_includes = (this[_options].includes || settings.includes).sort()

    if (new_includes.length !== curr_includes.length)
      needs_recompile = true

    else for (let i = 0; i < new_includes.length; i++) {
      if (new_includes[i] !== curr_includes[i]) {
        needs_recompile = true
        break
      }
    }

    if (needs_recompile)
      this[_compile](value)
    else
      this[_options] = value

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
