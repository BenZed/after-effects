import fs from 'fs'
import path from 'path'
import uglify from 'uglify-js'
import babel from 'babel-core'
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

//These compression options are to satisfy After Effect's old javascript engine.
const CompressionOptions = {
  conditionals: false
}

/******************************************************************************/
// Helpers
/******************************************************************************/

function babelify(){}

function minify(){}

function stringify(){}

/******************************************************************************/
// Exports
/******************************************************************************/

export default class Command {

  constructor(func, options) {
    this.func = func
    this.options = options
    this.compile()
  }

  compile() {

  }

  toString() {
    return stringify.call(this)
  }

  execute(...args) {

  }

  executeSync(...args) {

  }

}
