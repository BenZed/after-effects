import os from './os'
import Errors from '../errors'

const platform = (() => {

  const platform_name = os.platform()
  if (platform_name === 'darwin') //mac
    return require('./mac')

  else if (platform_name.includes('win')) { //windows 32 or 64
    return require('./win')

  } else
    throw new Error(Errors.UnsupportedPlatform)

})()

export default platform
