import fs from 'fs'
import path from 'path'

// Helper

export class NodeJsWritePermissionError extends Error {
  constructor(url: string) {
    super('NodeJs could not write a file needed by the "after-effects" package.' +
      ' Ensure that NodeJs has permission to write to directory: ' + path.dirname(url))
    this.name = 'NodeJsWritePermissionError'
  }
}

// Exports

export function isAccessibleDirSync(url: string) {

  let value

  try {
    value = fs.statSync(url).isDirectory()
  } catch {
    value = false
  }

  return value
}

export async function isAccessibleDir(url: string) {

  let value

  try {
    const stats = await fs.statSync(url)
    value = stats.isDirectory()
  } catch {
    value = false
  }

  return value

}

export function isAccessibleFileSync(url: string, ext?: string) {

  if (ext && path.extname(url) !== ext)
    return false

  let value

  try {
    value = fs.statSync(url).isFile()
  } catch {
    value = false
  }

  return value
}

export async function isAccessibleFile(url: string, ext?: string) {

  if (ext && path.extname(url) !== ext)
    return false

  let value

  try {
    const stats = await fs.statSync(url)
    value = stats.isFile()
  } catch {
    value = false
  }

  return value
}

export function readSync(url: string) {

  try {
    return fs.readFileSync(url, 'utf-8')
  } catch {
    throw new NodeJsWritePermissionError(url)
  }
}

export async function read(url: string): Promise<string> {

  try {
    return await new Promise((resolve, reject) => fs.readFile(url, (e, str) => e ? reject(e) : resolve(str.toString())))
  } catch {
    throw new NodeJsWritePermissionError(url)
  }
}

export function readDir(url: string): Promise<string[]> {
  return new Promise((resolve, reject) => fs.readdir(url, (e, names) => e ? reject(e) : resolve(names)))
}

export function readDirSync(url: string): string[] {
  return fs.readdirSync(url)
}

export async function write(url: string, txt: string): Promise<void> {

  try {
    return await new Promise<void>((resolve, reject) => fs.writeFile(url, txt, e => e ? reject(e) : resolve()))
  } catch {
    throw new NodeJsWritePermissionError(url)
  }

}

export function writeSync(url: string, txt: string) {

  try {
    fs.writeFileSync(url, txt)
  } catch {
    throw new NodeJsWritePermissionError(url)
  }

}

export function tryUnlinkSync(url: string) {

  try {
    fs.unlinkSync(url)
    return true
  } catch {
    return false
  }

}

export function tryUnlink(url: string): Promise<boolean> {
  return new Promise(resolve => fs.unlink(url, e => resolve(!e)))
}
