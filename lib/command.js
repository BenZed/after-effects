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

  let source = null;

  if ((0, _isExplicit2.default)(input, Function)) source = input.toString();

  // Dunno why the fuck someone would want to create a command
  // from an existing command, but whatever
  if ((0, _isExplicit2.default)(input, Command)) source = input[_symbols.SOURCE];

  // If string is a path, try and read the file it's a path to.
  if ((0, _isValidPath2.default)(input)) source = tryReadFile(input);

  // whatever other string it is better be valid code
  if ((0, _isExplicit2.default)(input, String)) source = input;

  if (source === null) throw new Error('Commands must be created with functions, urls to code files or blobs of code as a string');

  // If we're trying to use a js file that exports a single function as a source
  // we'll remove the export default so it doesn't break.
  // TODO there are probably a lot of cases this regeex doesn't support, such
  // as module.exports
  source = source.replace(/^\s?export\s+default/, '');

  return source;
}

function codify(isFunctionExpression, source) {

  // Source must be evaluated in parenthesis if we're making a function expression
  // otherwise this will break.
  source = isFunctionExpression ? `(${source})` : source;

  let prefixes = '';

  let babelified = (0, _transpile.babelify)(source);

  if (isFunctionExpression) {

    const funcStart = babelified.indexOf('(function');

    // Isolate the babel prefixes and remove the 'use strict' directive. (After Effects doesn't use it)
    prefixes = babelified.substring(0, funcStart).replace(/'use\sstrict';(\n)/, '').trim();

    // Isolate babelified code to just the function expression (remove babel prefixes and the final ;)
    babelified = babelified.substring(funcStart, babelified.length - 1);
  }

  return [prefixes, babelified];
}

function autoDetectFunctionExpression(source) {
  // Remove doubled whitespace
  source = source.replace(/\s\s/g, ' ').replace(/\s\s/g, ' ') // twice, to catch odd numbers
  .trim();

  // TODO there are a lot of cases this doesn't support. Do some testing and add more.
  const result =
  // Test if Arrow Function
  /^\(((\w| |\d|,)+)?\)\s?=>/.test(source) ||
  // Test if function keyword
  /^function\s?\(((\w| |\d|,)+)?\)\s?{/.test(source);

  return result;
}

/******************************************************************************/
// Exportsr
/******************************************************************************/

class Command {

  static fromSource(source) {

    return (0, _isExplicit2.default)(source, Command) ? source : new Command(source);
  }

  constructor(input, isFunctionExpression) {

    const source = inputToSource(input);

    // if the source is a function, then this command is definetly a function
    // expression
    isFunctionExpression = (0, _isExplicit2.default)(input, Function) ? true

    // otherwise, if an argument was explicitly defined, that will determine
    // if the source is a function expression
    : (0, _isExplicit2.default)(isFunctionExpression, Boolean) ? isFunctionExpression

    // Otherwise we try to auto detect
    : autoDetectFunctionExpression(source); // eslint-disable-line indent

    this[_symbols.SOURCE] = source;
    this[_symbols.CODE] = codify(isFunctionExpression, source);

    Object.defineProperty(this, 'isFunctionExpression', { value: isFunctionExpression });
  }

  toString() {
    return this[_symbols.CODE][1];
  }

}
exports.default = Command;