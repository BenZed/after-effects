import './globals'
import os from 'os'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'
import settings from './settings'
import Command from './command'
import Errors from './errors'
import is from 'is-explicit'

/******************************************************************************/
// Helper
/******************************************************************************/

/******************************************************************************/
// Exports
/******************************************************************************/

export default function (source, ...args) {
  executeSync(source, ...args)
}

export function execute (source, ...args) { }

export function executeSync (source, ...args) { }

export function create (source, ...args) { }

export function createSync (source, ...args) { }

export { options, Command }
