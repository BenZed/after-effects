import fs from 'fs'
import path from 'path'
import babel from 'babel-core'
import is from 'is-explicit'
import isPath from 'is-valid-path'

import { CODE, SOURCE } from './symbols'

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

function transpile () {

  

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default class Command {

  constructor (func) {

    if (!is(func, Function))
      throw new Error('Commands must be constructed with a function to send to After Effects.')

    this[SOURCE] = func.toString()

  }

}
