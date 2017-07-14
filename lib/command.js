'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _babelCore = require('babel-core');

var _babelCore2 = _interopRequireDefault(_babelCore);

var _isExplicit = require('is-explicit');

var _isExplicit2 = _interopRequireDefault(_isExplicit);

var _isValidPath = require('is-valid-path');

var _isValidPath2 = _interopRequireDefault(_isValidPath);

var _symbols = require('./symbols');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/******************************************************************************/
// Command Specific Configs
/******************************************************************************/

const BabelOptions = {
  presets: [require('babel-preset-es2015')],
  plugins: [require('babel-plugin-transform-es3-member-expression-literals'), require('babel-plugin-transform-es3-property-literals'), require('babel-plugin-transform-es5-property-mutators')],
  sourceRoot: __dirname

  /******************************************************************************/
  // Helper
  /******************************************************************************/

};function transpile() {}

/******************************************************************************/
// Exports
/******************************************************************************/

class Command {

  constructor(func) {

    if (!(0, _isExplicit2.default)(func, Function)) throw new Error('Commands must be constructed with a function to send to After Effects.');

    this[_symbols.SOURCE] = func.toString();
  }

}
exports.default = Command;