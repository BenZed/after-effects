
export const UnsupportedPlatform = 'Cannot run After Effects commands in an environment it can\'t be installed in.'

export const BadExecuteArgument = 'execute expects a function or AfterEffectsCommand instance.'

export const ApplicationNotFound = 'Cannot execute command, After Effects could not be found in your application directory. Install After Effects in your application directory, or provide a path in program option.'

export const NoResult = 'Could not get results from After Effects. Ensure that Preferences > General > Allow Scripts to Write Files and Access Network is enabled.'

export default {
  UnsupportedPlatform,
  BadExecuteArgument,
  ApplicationNotFound,
  NoResult
}

export class AfterEffectsError extends Error {
  constructor (message) {
    super(message)
    this.name = 'AfterEffectsError'
  }
}
