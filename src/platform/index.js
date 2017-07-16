import os from 'os'

import * as mac from './mac'
import * as win from './win'

const platformName = os.platform()
const platform = platformName === 'darwin'
  ? mac
  : platformName.includes('win')
    ? win
    : null

if (platform === null)
  throw new Error('Cannot run After Effects commands in an environment it can\'t be installed in.')

export default platform
