'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Command = exports.options = undefined;

exports.default = function () {
  executeSync(...arguments);
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

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

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

const options = {};

/******************************************************************************/
// Helper
/******************************************************************************/

function prepareCommand(funcOrCommand) {

  let command;

  if (is(funcOrCommand, _command2.default)) command = funcOrCommand;else if (is(funcOrCommand, Function)) command = new _command2.default(funcOrCommand);

  if (!is(command, _command2.default)) throw new Error(_errors2.default.BadExecuteArgument);

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  command.arguments = args;
  command.resultFile = null;

  return command;
}

/******************************************************************************/
// Exports
/******************************************************************************/

function execute() {}

function executeSync() {}

function create() {}

function createSync() {}

exports.options = options;
exports.Command = _command2.default;