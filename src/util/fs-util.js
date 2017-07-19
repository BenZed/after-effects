import fs from 'fs-extra'
import path from 'path'

/******************************************************************************/
// Helper
/******************************************************************************/

export class NodeJsWritePermissionError extends Error {
  constructor (url) {
    super('NodeJs could not write a file needed by the after-effects package.' +
    ' Ensure that NodeJs has permission to write to directory: ' + path.dirname(url))
    this.name = 'NodeJsWritePermissionError'
  }
}

/******************************************************************************/
// Exports
/******************************************************************************/

export function isAccessibleDirSync (url) {

  let value

  try {
    value = fs.statSync(url).isDirectory()
  } catch (err) {
    value = false
  }

  return value
}

export async function isAccessibleDir (url) {

  let value

  try {
    const stats = await fs.statSync(url)
    value = stats.isDirectory()
  } catch (err) {
    value = false
  }

  return value

}

export function isAccessibleFileSync (url, withExt) {

  if (withExt && path.extname(url) !== withExt)
    return false

  let value

  try {
    value = fs.statSync(url).isFile()
  } catch (err) {
    value = false
  }

  return value
}

export async function isAccessibleFile (url, withExt) {

  if (withExt && path.extname(url) !== withExt)
    return false

  let value

  try {
    const stats = await fs.statSync(url)
    value = stats.isFile()
  } catch (err) {
    value = false
  }

  return value
}

export async function write (url, txt) {

  try {
    await fs.writeFile(url, txt)
  } catch (err) {
    throw new NodeJsWritePermissionError(url)
  }

}

export function writeSync (url, txt) {

  try {
    fs.writeFileSync(url, txt)
  } catch (err) {
    throw new NodeJsWritePermissionError(url)
  }

}

export function tryUnlinkSync (url) {

  try {
    fs.unlinkSync(url)
  } catch (err) {
  }

}

export async function tryUnlink (url) {

  try {
    await fs.unlink(url)
  } catch (err) {
  }

}
