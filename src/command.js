import fs from 'fs'
import path from 'path'
import is from 'is-explicit'
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


const CompressionOptions = {
  conditionals: false
}

/******************************************************************************/
// Exports
/******************************************************************************/

export default class Command {

  constructor(func, options) {

  }

}
