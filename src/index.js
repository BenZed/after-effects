import './globals'
import os from 'os'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'
import Command from './command'

/******************************************************************************/
// Data
/******************************************************************************/

const DefaultOptions = {
  errorHandling: true,
  minify: false,
  program: null,
  includes : [
    path.join(__dirname, '/lib/includes/console.js'),
    path.join(__dirname, '/lib/includes/es5-shim.js'),
    path.join(__dirname, '/lib/includes/get.js')
  ]
}
