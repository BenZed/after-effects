'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.DefaultSettings = undefined

var _path = require('path')

var _path2 = _interopRequireDefault(_path)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

/******************************************************************************/
// Data
/******************************************************************************/

var DefaultSettings = exports.DefaultSettings = Object.freeze({
  errorHandling: true,
  program: null,
  includes: [_path2.default.join(__dirname, '/lib/includes/console.js'), _path2.default.join(__dirname, '/lib/includes/extendscript-es5-shim.js'), _path2.default.join(__dirname, '/lib/includes/get.js')]
})

var settings = Object.assign({}, DefaultSettings)

exports.default = settings
