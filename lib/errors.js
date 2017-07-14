'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const ERRORS = {
  UnsupportedPlatform: 'Cannot run After Effects commands in an environment it can\'t be installed in.',
  BadExecuteArgument: 'execute expects a function or AfterEffectsCommand instance.',
  ApplicationNotFound: 'Cannot execute command, After Effects could not be found in your application directory. Install After Effects in your application directory, or provide a path in program option.',
  NoResult: 'Could not get results from After Effects. Ensure that Preferences > General > Allow Scripts to Write Files and Access Network is enabled.'
};

exports.default = ERRORS;
class AfterEffectsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AfterEffectsError';
  }
}
exports.AfterEffectsError = AfterEffectsError;