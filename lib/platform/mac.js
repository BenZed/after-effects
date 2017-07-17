'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.executeSync = executeSync;
exports.execute = execute;
exports.createSync = createSync;
exports.create = create;
exports.getScriptsDir = getScriptsDir;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _jsesc = require('jsesc');

var _jsesc2 = _interopRequireDefault(_jsesc);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _child_process = require('child_process');

var _transpile = require('../util/transpile');

var _fsUtil = require('../util/fs-util');

var _errors = require('./errors');

var _command = require('../command');

var _command2 = _interopRequireDefault(_command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/******************************************************************************/
// Data
/******************************************************************************/

const TMP = _os2.default.tmpdir();

const DEFAULT_PROGRAM_DIR = _path2.default.resolve('/Applications');

/******************************************************************************/
// Errors
/******************************************************************************/

class CouldNotCreateAppleScriptError extends Error {
  constructor(msg) {
    super('Could not create AppleScript file for After Effects execution' + (msg ? ': ' + msg : '.'));

    this.name = 'CouldNotCreateAppleScript';
  }
}

function checkForMissingAppHack(error) {
  // I haven't bothered how to use applescript well enough to determine if the
  // After Effects app exists or not. So, rather than figure it out, I'll just
  // look for an error that includes this string, because that error means that
  // DoScript couldn't complete, which means the suggested After Effects app doesnt
  // exist.
  return error.message.includes('Expected end of line but found') ? new _errors.AfterEffectsMissingError() : error;
}

/******************************************************************************/
// Find After Effects
/******************************************************************************/

function afterEffectsNameMatch(url, renderEngine) {

  const ext = _path2.default.extname(url);
  const basename = _path2.default.basename(url, ext);

  const key = 'Adobe After Effects' + (renderEngine ? ' Render Engine' : '');

  return basename.includes(key);
}

async function getAfterEffectsInDir(dir, renderEngine) {

  const names = await _fsExtra2.default.readdir(dir);
  for (const name of names) {
    const url = _path2.default.join(dir, name);

    // In Mac, The After Effects program is really just another Directory, so we
    // cant check if it's an accessible file.
    if ((await (0, _fsUtil.isAccessibleDir)(url)) && afterEffectsNameMatch(url, renderEngine) && url.endsWith('.app')) return url;
  }

  return null;
}

function getAfterEffectsInDirSync(dir, renderEngine) {

  const names = _fsExtra2.default.readdirSync(dir);
  for (const name of names) {
    const url = _path2.default.join(dir, name);

    // In Mac, The After Effects program is really just another Directory, so we
    // cant check if it's an accessible file.
    if ((0, _fsUtil.isAccessibleDirSync)(url) && afterEffectsNameMatch(url, renderEngine) && url.endsWith('.app')) return url;
  }

  return null;
}

async function findAfterEffects(dir = DEFAULT_PROGRAM_DIR, renderEngine) {

  let afterEffects = await getAfterEffectsInDir(dir, renderEngine);
  if (afterEffects) return afterEffects;

  const names = await _fsExtra2.default.readdir(dir);
  for (const name of names) {

    const url = _path2.default.join(dir, name);

    if ((await (0, _fsUtil.isAccessibleDir)(url)) && afterEffectsNameMatch(url)) afterEffects = await findAfterEffects(url, renderEngine);

    if (afterEffects) break;
  }

  return afterEffects;
}

function findAfterEffectsSync(dir = DEFAULT_PROGRAM_DIR, renderEngine) {

  let afterEffects = getAfterEffectsInDirSync(dir, renderEngine);
  if (afterEffects) return afterEffects;

  const names = _fsExtra2.default.readdirSync(dir);
  for (const name of names) {

    const url = _path2.default.join(dir, name);

    if ((0, _fsUtil.isAccessibleDirSync)(url) && afterEffectsNameMatch(url)) afterEffects = findAfterEffectsSync(url, renderEngine);

    if (afterEffects) break;
  }

  return afterEffects;
}

/******************************************************************************/
// Apple Script
/******************************************************************************/

function escaped(quotes = 'double') {
  return (0, _jsesc2.default)(this, { quotes });
}

const execPromise = (...args) => new Promise((resolve, reject) => {
  (0, _child_process.exec)(...args, (err, result) => {
    if (err) reject(err);else resolve(result);
  });
});

function prepareAppleScript(adobified, aeUrl) {

  const scptUrl = _path2.default.join(TMP, `ae-command-${_uuid2.default.v4()}.scpt`);

  if (aeUrl.includes('Render Engine.app')) throw new Error('Activating the Render Engine for Mac needs to be rethought.' + ' It cannot be given tells from applescript like the regular app can. We need' + ' to come up with a way to detect if the render engine is running, and switch to it' + ' if it is not.');

  const scptTxt = [`tell application "${aeUrl}"`, `  DoScript "${escaped.call(adobified)}"`, 'end tell'].join('\n');

  return [scptUrl, scptTxt];
}

function writeAppleScriptSync(adobified, aeUrl) {

  const [scptUrl, scptTxt] = prepareAppleScript(adobified, aeUrl);

  try {
    _fsExtra2.default.writeFileSync(scptUrl, scptTxt);
  } catch (err) {
    throw new CouldNotCreateAppleScriptError(err.message);
  }

  return scptUrl;
}

async function writeAppleScript(adobified, aeUrl) {

  const [scptUrl, scptTxt] = prepareAppleScript(adobified, aeUrl);

  try {
    await _fsExtra2.default.writeFile(scptUrl, scptTxt);
  } catch (err) {
    throw new CouldNotCreateAppleScriptError(err.message);
  }

  return scptUrl;
}

function executeAppleScriptSync(scriptUrl, resultUrl, logger) {

  try {
    (0, _child_process.execSync)(`osascript ${scriptUrl}`);
  } catch (err) {
    throw checkForMissingAppHack(err);
  }

  return parseResults(resultUrl, logger);
}

async function executeAppleScript(scriptUrl, resultUrl, logger) {

  try {
    await execPromise(`osascript ${scriptUrl}`);
  } catch (err) {
    log.task(err);
    throw checkForMissingAppHack(err);
  }

  return parseResults(resultUrl, logger);
}

function parseResults(resultUrl, logger) {

  // Adobe doesn't have a JSON object, but it does have a function called 'toSource()'
  // which returns an eval()ible string that describes a javascript obbject.
  // as a result, we have to syncronously require() the results.

  if (resultUrl === null) return null;

  let results;

  try {
    results = require(resultUrl);
  } catch (err) {
    throw new _errors.NoResultError(err.message);
  }

  const { error, logs = [], result } = results;

  for (const log of logs) logger(log);

  if (error) throw new _errors.AfterEffectsScriptError(error);

  return result;
}

/******************************************************************************/
// Creating Scripts
/******************************************************************************/

function prepareJsx(source, url, options, ...args) {

  const command = _command2.default.fromSource(source);

  const createOptions = _extends({}, options, {
    handleErrors: false,
    writeResults: false
  });

  const { adobified } = (0, _transpile.adobify)(command, createOptions, ...args);

  // Add .jsx if an extension wasn't provided
  if (!_path2.default.extname(url)) url += '.jsx';

  const jsxUrl = _path2.default.isAbsolute(url) ? url : _path2.default.resolve(getScriptsDir(createOptions), url);

  return {
    adobified,
    jsxUrl
  };
}
/******************************************************************************/
// Exports
/******************************************************************************/

function executeSync(source, ...args) {

  const command = _command2.default.fromSource(source);

  const { adobified, resultUrl } = (0, _transpile.adobify)(command, this.options, ...args);
  const { programDir, renderEngine, logger } = this.options;

  const aeUrl = findAfterEffectsSync(programDir, renderEngine);
  if (aeUrl === null) throw new _errors.AfterEffectsMissingError();

  const scrptUrl = writeAppleScriptSync(adobified, aeUrl);

  return executeAppleScriptSync(scrptUrl, resultUrl, logger);
}

async function execute(source, ...args) {

  const command = _command2.default.fromSource(source);

  const { adobified, resultUrl } = (0, _transpile.adobify)(command, this.options, ...args);
  const { programDir, renderEngine, logger } = this.options;

  const aeUrl = await findAfterEffects(programDir, renderEngine);
  if (aeUrl === null) throw new _errors.AfterEffectsMissingError();

  const scrptUrl = await writeAppleScript(adobified, aeUrl);

  return executeAppleScript(scrptUrl, resultUrl, logger);
}

function createSync(source, url, ...args) {

  const { jsxUrl, adobified } = prepareJsx(source, url, this.options, ...args);

  _fsExtra2.default.writeFileSync(jsxUrl, adobified);

  return jsxUrl;
}

async function create(source, url, ...args) {

  const { jsxUrl, adobified } = prepareJsx(source, url, this.options, ...args);

  await _fsExtra2.default.writeFile(jsxUrl, adobified);

  return jsxUrl;
}

function getScriptsDir(options) {

  const { programDir } = options || this.options;

  const aeUrl = findAfterEffectsSync(programDir);
  if (aeUrl === null) return null;

  const aeDir = _path2.default.dirname(aeUrl);

  return _path2.default.join(aeDir, 'Scripts');
}