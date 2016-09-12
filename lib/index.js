'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Command = exports.options = undefined;

exports.default = function (source) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  executeSync.apply(undefined, [source].concat(args));
};

exports.execute = execute;
exports.executeSync = executeSync;
exports.create = create;
exports.createSync = createSync;

require('./globals');

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

var _isExplicit = require('is-explicit');

var _isExplicit2 = _interopRequireDefault(_isExplicit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function execute(source) {}

/******************************************************************************/
// Helper
/******************************************************************************/

/******************************************************************************/
// Exports
/******************************************************************************/

function executeSync(source) {}

function create(source) {}

function createSync(source) {}

exports.options = options;
exports.Command = _command2.default;