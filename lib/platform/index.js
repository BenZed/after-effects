'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _os = require('./os');

var _os2 = _interopRequireDefault(_os);

var _errors = require('../errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const platformName = _os2.default.platform();
const platform = platformName === 'darwin' ? require('./mac') : platformName.includes('win') ? require('./win') : null;

if (platform === null) throw new Error(_errors2.default.UnsupportedPlatform);

exports.default = platform;