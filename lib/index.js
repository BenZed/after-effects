'use strict';

require('./globals');

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/******************************************************************************/
// Data
/******************************************************************************/

const DefaultOptions = {
  errorHandling: true,
  minify: false,
  program: null,
  includes: [_path2.default.join(__dirname, '/lib/includes/console.js'), _path2.default.join(__dirname, '/lib/includes/es5-shim.js'), _path2.default.join(__dirname, '/lib/includes/get.js')]
};