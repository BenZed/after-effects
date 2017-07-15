'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _isExplicit = require('is-explicit');

var _isExplicit2 = _interopRequireDefault(_isExplicit);

var _isValidPath = require('is-valid-path');

var _isValidPath2 = _interopRequireDefault(_isValidPath);

var _symbols = require('./util/symbols');

var _transpile = require('./util/transpile');

var _transpile2 = _interopRequireDefault(_transpile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/******************************************************************************/
// Helper
/******************************************************************************/

function tryReadFile(url) {

  try {
    return _fs2.default.readFileSync(url, 'utf-8');
  } catch (err) {
    // Prettier error than ENONENT or whatever
    throw new Error(`Could not read ${url}. Ensure it that it is a valid file url and that you have permissions.`);
  }
}

function inputToSource(input) {

  if ((0, _isExplicit2.default)(input, Function)) return input.toString();

  // Dunno why the fuck someone would want to create a command
  // from an existing command, but whatever
  if ((0, _isExplicit2.default)(input, Command)) return input[_symbols.SOURCE];

  // If string is a path, try and read the file it's a path to.
  if ((0, _isValidPath2.default)(input)) return tryReadFile(input);

  // whatever other string it is better be valid code
  if ((0, _isExplicit2.default)(input, String)) return input;

  throw new Error('Commands must be created with functions, urls to code files or blobs of code as a string');
}

function codify(source) {

  // Pass source function as an expression otherwise it will break when being isolated
  const transpiled = (0, _transpile2.default)(`(${source})`);

  // Isolate babelified code to just the function expression (remove babel prefixes and the final ;)
  const funcStart = transpiled.indexOf('(function');
  const funcExpression = transpiled.substring(funcStart, transpiled.length - 1);

  // Isolate the babel prefixes and remove the 'use strict' directive. (After Effects doesn't use it)
  const babelPrefixes = transpiled.substring(0, funcStart).replace(/'use\sstrict';(\n)/, '').trim();

  return [babelPrefixes, funcExpression];
}

/******************************************************************************/
// Exportsr
/******************************************************************************/

class Command {

  static fromSource(source) {

    return (0, _isExplicit2.default)(source, Command) ? source : new Command(source);
  }

  constructor(input) {

    const source = inputToSource(input);

    this[_symbols.SOURCE] = source;
    this[_symbols.CODE] = codify(source);
  }

  toString() {
    return this[_symbols.CODE][1];
  }

}
exports.default = Command;