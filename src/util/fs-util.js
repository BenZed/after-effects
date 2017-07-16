import fs from 'fs-extra'
import path from 'path'

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

export async function isAccessibleFileDir (url, withExt) {

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
