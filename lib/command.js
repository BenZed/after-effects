'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _uglifyJs = require('uglify-js');

var _uglifyJs2 = _interopRequireDefault(_uglifyJs);

var _babelCore = require('babel-core');

var _babelCore2 = _interopRequireDefault(_babelCore);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/******************************************************************************/
// Command Specific Configs
/******************************************************************************/

const BabelOptions = {
  presets: [require('babel-preset-es2015')],
  plugins: [require('babel-plugin-transform-es3-member-expression-literals'), require('babel-plugin-transform-es3-property-literals'), require('babel-plugin-transform-es5-property-mutators')],
  sourceRoot: __dirname
};

//These compression options are to satisfy After Effect's old javascript engine.
const CompressionOptions = {
  conditionals: false
};

/******************************************************************************/
// Helpers
/******************************************************************************/

function babelify() {}

function minify() {}

function stringify() {}

/******************************************************************************/
// Exports
/******************************************************************************/

class Command {

  constructor(func, options) {
    this.func = func;
    this.options = options;
    this.compile();
  }

  compile() {}

  toString() {
    return stringify.call(this);
  }

  execute() {}

  executeSync() {}

}
exports.default = Command;