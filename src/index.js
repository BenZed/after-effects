import './globals'
import os from 'os'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'
import Command from './command'
import Errors from './errors'
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

const options = {}

/******************************************************************************/
// Helper
/******************************************************************************/

function prepareCommand(funcOrCommand, ...args) {

  let command

  if (is(funcOrCommand, Command))
    command = funcOrCommand

  else if (is(funcOrCommand, Function))
    command = new Command(funcOrCommand)

  if (!is(command, Command))
    throw new Error(Errors.BadExecuteArgument)

  command.arguments = args
  command.resultFile = null

  return command

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default function (...args) {
  executeSync(...args)
}

export function execute() { }

export function executeSync() { }

export function create() { }

export function createSync() { }

export { options, Command }
