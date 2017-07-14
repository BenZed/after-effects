'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _isExplicit = require('is-explicit');

var _isExplicit2 = _interopRequireDefault(_isExplicit);

var _symbols = require('./util/symbols');

var _transpile = require('./util/transpile');

var _transpile2 = _interopRequireDefault(_transpile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/******************************************************************************/
// Helper
/******************************************************************************/

function codify(source) {

  const transpiled = (0, _transpile2.default)(source);

  return transpiled;
}

/******************************************************************************/
// Exports
/******************************************************************************/

class Command {

  constructor(func) {

    if (!(0, _isExplicit2.default)(func, Function)) throw new Error('Commands must be constructed with a function to send to After Effects.');

    const source = func.toString();

    this[source] = source;
    this[_symbols.CODE] = codify(source);
  }

  toString() {
    return this[_symbols.CODE];
  }

}
exports.default = Command;