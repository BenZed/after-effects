import os from 'os'
import ERRORS from '../util/errors'

const platformName = os.platform()
const platform = platformName === 'darwin'
  ? require('./mac')
  : platformName.includes('win')
    ? require('./win')
    : null

if (platform === null)
  throw new Error(ERRORS.UnsupportedPlatform)

export default platform
