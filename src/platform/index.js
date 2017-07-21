import os from './os'
import Errors from '../errors'

const platform = (() => {
  const platformName = os.platform()
  if (platformName === 'darwin') { // mac
    return require('./mac')
  } else if (platformName.includes('win')) { // windows 32 or 64
    return require('./win')
  } else {
    throw new Error(Errors.UnsupportedPlatform)
  }
})()

export default platform
