'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Command = exports.AfterEffects = undefined;

var _factory = require('./factory');

var _factory2 = _interopRequireDefault(_factory);

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.AfterEffects = _factory2.default;
exports.Command = _command2.default;
exports.default = new _factory2.default();