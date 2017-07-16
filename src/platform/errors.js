
export class AfterEffectsMissingError extends Error {
  constructor (message) {
    super('After Effects could not be found.' + (message ? '\n' + message : ''))
    this.name = 'AfterEffectsMissing'
  }
}

export class NoResultError extends Error {
  constructor (message) {
    super('Could not get results from After Effects. Ensure that "Preferences" >' +
    ' "General" > "Allow Scripts" to Write Files and Access Network is enabled.' +
    (message ? '\n' + message : ''))

    this.name = 'NoResultError'
  }
}

export class AfterEffectsScriptError extends Error {
  constructor (message) {
    super('Script execution error inside of After Efects' + (message ? ': ' + message : '.'))
    this.name = 'AfterEffectsScriptError'
  }
}
