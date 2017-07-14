'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultSettings = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/******************************************************************************/
// Data
/******************************************************************************/

const DefaultSettings = exports.DefaultSettings = Object.freeze({
  errorHandling: true,
  program: null,
  includes: [_path2.default.join(__dirname, '/lib/includes/console.js'), _path2.default.join(__dirname, '/lib/includes/extendscript-es5-shim.js'), _path2.default.join(__dirname, '/lib/includes/get.js')]
});

const settings = _extends({}, DefaultSettings);

exports.default = settings;